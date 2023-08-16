import { Product } from "@prisma/client";
import React, {
  Dispatch,
  LegacyRef,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

type TableProductProps = {
  p: Product;
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  price: z.number(),
  altText: z.string(),
  image: z.instanceof(Blob),
});

export const TableProduct = ({ p, setProducts }: TableProductProps) => {
  const { register } = useForm<Product>({
    defaultValues: {
      name: p.name,
      description: p.description,
      price: p.price,
      altText: p.altText,
    },
    resolver: zodResolver(productSchema),
  });
  const [product, setProduct] = useState<Product>(p);
  const imageInput = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<Blob>();
  const router = useRouter();

  const handleChange = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", String(product.price));
    formData.append("altText", product.altText);
    formData.append("image", image as Blob);
    const res = await fetch(`http://127.0.0.1:3000/api/product/${product.id}`, {
      method: "PUT",
      body: formData,
    });
    if(res.status === 200) router.reload()
  };

  const handleDelete = async () => {
    const res = await fetch(`http://127.0.0.1:3000/api/product/${product.id}`, {
      method: "DELETE",
    });
    if (res.status === 204) router.reload();
  };

  return (
    <tr className="table-fixed border-t border-accent table h-48 w-full">
      <td className="relative cursor-pointer">
        <Image
          src={product.image}
          alt={product.altText}
          width={250}
          height={250}
          onClick={() => imageInput.current?.click()}
        />
        <input
          ref={imageInput}
          type="file"
          className="hidden"
          onChange={(e) => {
            setImage(e.target.files ? e.target.files[0] : undefined);
          }}
        />
        {image && (
          <Image
            src={image ? URL.createObjectURL(image) : ""}
            width={100}
            height={100}
            alt="new image"
            className="max-h-[50%] max-w-[50%] absolute top-0 right-0"
          />
        )}
      </td>
      <td>
        <input placeholder="Product Name" {...register("name")} type="text" onChange={(e) => setProduct(p => ({...p, name: e.target.value}))} />
      </td>
      <td>
        <div className="w-full h-full overflow-y-auto flex flex-col justify-center">
          <input
            placeholder="Product Description"
            {...register("description")}
            onChange={(e) => setProduct(p => ({...p, description: e.target.value}))}
            type="text"
          />
        </div>
      </td>
      <td>
        <input
          placeholder="Product Price"
          {...register("price")}
          onChange={(e) => setProduct(p => ({...p, price: Number(e.target.value)}))}
          type="number"
        />
      </td>
      <td>
        <input
          placeholder="Accessibility text"
          {...register("altText")}
          onChange={(e) => setProduct(p => ({...p, altText: e.target.value}))}          
          type="text"
        />
      </td>
      <td>
        <div className="flex flex-row justify-evenly">
          <Button onClick={handleChange}>Save Changes</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </td>
    </tr>
  );
};
