import { useAuth } from "@/context/AuthContext";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const { authTokens } = useAuth();

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("altText", altText);
    formData.append("image", image);

    
    const res = await fetch("/api/product", {
      method: "POST",
      body: formData,
    });

    // 201 - Created
    if (res.status === 201) {
      clearFields();
    }
  };

  const clearFields = () => {
    setName("");
    setAltText("");
    setPrice(0);
    setDescription("");
    setImage(null);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    setImage(e.target.files ? e.target.files[0] : null);

  return (
    <div className="w-fit mx-auto bg-blue-500 p-8 mt-16 rounded text-black">
      <h1>Create a New Product</h1>
      <form
        onSubmit={handleCreate}
        encType="multipart/form-data"
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Name of Product"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Description of Product"
        />
        <input
          type="file"
          placeholder="Product image"
          accept="image/*"
          name="image"
          onChange={onFileChange}
        />
        <input
          type="text"
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value);
          }}
          placeholder="Alt Text"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value));
          }}
          placeholder="Price of Product"
        />
        <input
          className="cursor-pointer mt-8"
          type="submit"
          value="Create Product"
        />
      </form>
    </div>
  );
};

export default CreateProduct;
