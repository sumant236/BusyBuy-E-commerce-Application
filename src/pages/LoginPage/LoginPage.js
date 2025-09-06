import { useRef, useContext, useState } from "react";
import styles from "./LoginPage.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { authContext } from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser } = useContext(authContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .then(() => {
        navigate("/");
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
      <form className={styles.form}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className={styles.loginInput}
          ref={emailRef}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className={styles.loginInput}
          ref={passwordRef}
        />
        <button className={styles.loginBtn} onClick={handleLogin}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
          to="/signup"
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default LoginPage;
