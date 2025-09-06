import { useState, useContext } from "react";
import styles from "./ProductDetails.module.css";
import MinusIcon from "../../../UI/Icons/MinusIcon";
import PlusIcon from "../../../UI/Icons/PlusIcon";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import { toast } from "react-toastify";
import { authContext } from "../../../../context/Auth/AuthContext";

const ProductDetails = ({
  product: { title, price, quantity },
  product,
  onCart,
}) => {
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingCart] = useState(false);
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  // Function to add product to cart
  const addProductToCart = async () => {
    if (!user) {
      navigate("/signin");
    }
    setProductAddingToCart(true);
    try {
      const productRef = doc(
        db,
        "users",
        user.uid,
        "cartItems",
        String(product.id)
      );
      const docSnap = await getDoc(productRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        await updateProductQuantity(docSnap.data().quantity + 1);
        toast.success("Product added successfully!");
      } else {
        // new cart if it does not exist
        setDoc(productRef, { ...product, quantity: 1 });
        toast.success("Product added successfully!");
      }
    } catch (e) {
      toast.error(e.code);
    }
    setProductAddingToCart(false);
  };

  // Function for Handling the product quantity
  const updateProductQuantity = async (newQuantity) => {
    try {
      const productRef = doc(
        db,
        "users",
        user.uid,
        "cartItems",
        String(product.id)
      );

      if (newQuantity === 0) {
        removeProductFromCart();
        toast.success("Product removed from cart!");
      } else {
        await updateDoc(productRef, { quantity: newQuantity });
      }
    } catch (e) {
      toast.error(e.code);
    }
  };

  // function to remove the cart
  const removeProductFromCart = async () => {
    setProductRemovingCart(true);

    try {
      const productRef = doc(
        db,
        "users",
        user.uid,
        "cartItems",
        String(product.id)
      );
      console.log(productRef);

      deleteDoc(productRef);
      toast.success("Product removed successfully!");
    } catch (e) {
      toast.error(e.code);
    }
    setProductRemovingCart(false);
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{`${title.slice(0, 35)}...`}</p>
      </div>
      <div className={styles.productOptions}>
        <p>₹ {price}</p>
        {onCart && (
          <div className={styles.quantityContainer}>
            <MinusIcon
              handleRemove={() => updateProductQuantity(quantity - 1)}
            />
            {quantity}
            <PlusIcon handleAdd={() => updateProductQuantity(quantity + 1)} />
          </div>
        )}
      </div>
      {/* Conditionally Rendering buttons based on the screen */}
      {!onCart ? (
        <button
          className={styles.addBtn}
          title="Add to Cart"
          onClick={addProductToCart}
        >
          {productAddingToCart ? "Adding" : "Add To Cart"}
        </button>
      ) : (
        <button
          className={styles.removeBtn}
          title="Remove from Cart"
          onClick={removeProductFromCart}
        >
          {productRemovingFromCart ? "Removing" : "Remove From Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
