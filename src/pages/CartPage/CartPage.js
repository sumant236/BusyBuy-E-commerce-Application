import { useEffect, useContext, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./CartPage.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContext } from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
import ProductList from "../../components/Product/ProductList/ProductList";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [itemList, setItemList] = useState(null);
  const { user } = useContext(authContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchasingStatus, setPurchasingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) getUserCartItems();
  }, []);

  // function to Clear user cart
  const clearCart = async () => {
    try {
      const cartItemsRef = await getDocs(
        collection(db, "users", user.uid, "cartItems")
      );

      const deletePromises = cartItemsRef.docs.map((productDoc) => {
        const productDocRef = doc(
          db,
          "users",
          user.uid,
          "cartItems",
          productDoc.id
        );
        return deleteDoc(productDocRef);
      });

      await Promise.all(deletePromises);
      toast.success("All products have been removed from the cart!");
    } catch (e) {
      toast.error(e.code);
    }
  };

  // function to Fetch user cart products
  const getUserCartItems = () => {
    setLoading(true);
    onSnapshot(collection(db, "users", user.uid, "cartItems"), (snapshot) => {
      setTotalPrice(0);
      const cartItems = snapshot.docs.map((doc) => {
        setTotalPrice((prev) => prev + doc.data().quantity * doc.data().price);
        return { ...doc.data() };
      });
      setItemList(cartItems);
    });
    setLoading(false);
  };

  const handlePurchase = () => {
    setPurchasingStatus(true);
    try {
      const cartRef = collection(db, "users", user.uid, "ordersList");
      addDoc(cartRef, {
        items: itemList,
        orderedOn: new Date(),
        totalPrice: itemList.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      });
      clearCart();
      navigate("/myorders");
    } catch (e) {
      console.log(e);
      toast.error(e.code);
    }
  };

  return (
    <div className={styles.cartPageContainer}>
      {loading ? (
        <Loader />
      ) : itemList && itemList.length !== 0 ? (
        <>
          {/* Component to display the item in the cart if there are items present in the cart. */}
          <aside className={styles.totalPrice}>
            <p>{`Total Price:- ₹ ${totalPrice}`}</p>
            <button className={styles.purchaseBtn} onClick={handlePurchase}>
              {purchasingStatus ? "Purchasing" : "Purchase"}
            </button>
          </aside>
          <ProductList products={itemList} onCart={true} />
        </>
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
