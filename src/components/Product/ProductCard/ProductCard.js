import React from "react";
import ProductContainer from "../ProductContainer/ProductContainer";
import ProductDetails from "../ProductContainer/ProductDetails/ProductDetails";
import ProductImage from "../ProductContainer/ProductImage/ProductImage";

// Product Card component
const ProductCard = ({ product, onCart }) => {
  return (
    <ProductContainer>
      <ProductImage image={product.image} />
      <ProductDetails onCart={onCart} product={product} />
    </ProductContainer>
  );
};

export default ProductCard;
