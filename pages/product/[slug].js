import { useRouter } from "next/router";
import React from "react";
import data from "../../utils/data";

export default function ProductScreen() {
  const router = useRouter();
  const { slug } = router.query;
  //   fetch the product form data's and find the slug of the product
  const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return <div>{product.name}</div>;
}
