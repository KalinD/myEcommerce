import React, { ChangeEvent, FormEvent, useState, Dispatch } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import Product from "./Product";
import Image from "next/image";

const ProductForm = ({
  setIsOpen,
  product,
  setProducts,
}: {
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  product?: Product;
  setProducts: Dispatch<React.SetStateAction<Product[]>>;
}) => {
  const [name, setName] = useState(product ? product.name : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price / 100 : 0);
  const [image, setImage] = useState<Blob>();
  const [altText, setAltText] = useState(product ? product.altText : "");

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String((price * 100).toFixed(0)));
    formData.append("altText", altText);
    formData.append("image", image as Blob);
    let method = "POST";
    let url = "/api/product";
    if (product) {
      method = "PUT";
      url = `/api/product/${product.id}`;
    }

    const res = await fetch(url, {
      method: method,
      body: formData,
    });

    if (res.status === 201) {
      // 201 - Created => POST request
      clearFields();
      setIsOpen(false);
      const newProduct = await res.json();
      setProducts((oldProducts) => [...oldProducts, newProduct]);
    }
    if (res.status === 200) {
      // 200 - OK => PUT request
      clearFields();
      setIsOpen(false);
      const updatedProduct = await res.json();
      setProducts((oldProducts) => {
        const copy = [...oldProducts];
        const index = oldProducts.indexOf(
          oldProducts.find((p) => p.id === updatedProduct.id) as Product
        );
        copy[index] = updatedProduct;
        return copy;
      });
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
        <div className="flex flex-row">
          <div className="flex flex-col justify-center m-4 relative">
            {product && (
              <Image
                src={product.image}
                alt={product.altText}
                width={200}
                height={200}
              />
            )}
            {image && (
              <Image
                src={image ? URL.createObjectURL(image) : ""}
                width={200}
                height={200}
                alt="new image"
                className={product ? "max-h-[50%] max-w-[50%] absolute top-0 right-0" : ""}
              />
            )}
          </div>
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
              disabled={product ? true : false}
              value={price.toFixed(2)}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
              placeholder="Price of Product"
            />
            <div className="flex flex-row justify-evenly">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-500/90"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
