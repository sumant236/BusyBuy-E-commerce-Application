import { useRef, useContext, useState } from "react";
import styles from "./RegisterPage.module.css";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/Auth/AuthContext";
import { db } from "../../config/firebase";

const RegisterPage = () => {
  const [loading, setLoading] = useState();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser } = useContext(authContext);

  // submit handler function to validate the form and signup the user
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (name === "" || email === "" || password === "" || password.length < 6) {
      return toast.error("Please enter valid data!");
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        setDoc(doc(db, "users", user.uid), {
          name,
          email: user.email,
        });
        setUser({ name, ...user });
        localStorage.setItem("user", JSON.stringify(user));
      })
      .then(() => {
        navigate("/");
        return toast.success("User Registered Successfully");
      })
      .catch((e) => {
        return toast.error(e.code);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          className={styles.loginInput}
          ref={nameRef}
        />
        <input
          type="email"
          name="email"
          className={styles.loginInput}
          placeholder="Enter Email"
          ref={emailRef}
        />
        <input
          type="password"
          name="password"
          className={styles.loginInput}
          placeholder="Enter Password"
          ref={passwordRef}
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
