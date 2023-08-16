import React, { ChangeEvent, FormEvent, useState, Dispatch } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const CreateProductForm = ({setIsOpen}: {setIsOpen: Dispatch<React.SetStateAction<boolean>>}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<Blob>();
  const [altText, setAltText] = useState("");

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("altText", altText);
    formData.append("image", image as Blob);

    const res = await fetch("/api/product", {
      method: "POST",
      body: formData,
    });

    // 201 - Created
    if (res.status === 201) {
      clearFields();
      setIsOpen(false)
    }
  };

  const clearFields = () => {
    setName("");
    setAltText("");
    setPrice(0);
    setDescription("");
    setImage(undefined);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    setImage(e.target.files ? e.target.files[0] : undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Product</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleCreate}
          encType="multipart/form-data"
          className="flex flex-col gap-3"
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Name of Product"
          />
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Description of Product"
          />
          <Input
            type="file"
            placeholder="Product image"
            accept="image/*"
            name="image"
            onChange={onFileChange}
          />
          <Input
            type="text"
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value);
            }}
            placeholder="Alt Text"
          />
          <Input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
            placeholder="Price of Product"
          />
          <div className="flex flex-row justify-evenly">
          <Button type="button" className="bg-gray-500 hover:bg-gray-500/90" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit">Create Product</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
