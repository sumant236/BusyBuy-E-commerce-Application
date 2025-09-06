import { useState, useEffect, useContext } from "react";
import styles from "./OrdersPage.module.css";
import { authContext } from "../../context/Auth/AuthContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { user } = useContext(authContext);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  // Fetch user orders from firestore
  const getOrders = async () => {
    try {
      const ordersRef = collection(db, "users", user.uid, "ordersList");
      const q = query(ordersRef, orderBy("orderedOn", "desc"));
      const querySnapshot = await getDocs(q);

      const orders = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setOrderList(orders);
      console.log(orders);
    } catch (e) {
      toast.error(e.code);
    }
  };

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  // if(write condition when there are no order present and the loader has been set to false)
  return orderList.length <= 0 ? (
    <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>
  ) : (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        {orderList.map((order) => (
          <div key={order.id}>
            <h2>Ordered On:- {getFormattedDate(order.orderedOn.toDate())}</h2>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const truncated = truncateText(item.title, 25);
                  return (
                    <tr key={item.id}>
                      <td>{truncated}</td>
                      <td>₹ {item.price} </td>
                      <td>{item.quantity} </td>
                      <td>₹ {item.price * item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={styles.totalPrice}>
                  <td>₹ {order.totalPrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
