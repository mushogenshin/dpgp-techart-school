import { useState, useEffect } from "react";
import { useEmailLinkLogin } from "../../hooks/useEmailLinkLogin";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

// styles
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const { sendSignInLink, error, isPending, linkSent } = useEmailLinkLogin();
  const { dispatch } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendSignInLink(email);
  };

  useEffect(() => {
    const auth = getAuth();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          dispatch({ type: "LOGIN", payload: result.user });

          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null

          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles["login-form"]}>
      <h2>Đăng Nhập</h2>
      <small>
        Nhập địa chỉ email mà bạn đã dùng khi ghi danh với Dẫu Phải Giải Phẫu
        trong quá khứ
      </small>
      <label>
        <span>Email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      {/* prevent multiple requests during pending */}
      {isPending ? (
        <button className="btn" disabled>
          Loading
        </button>
      ) : (
        <button className="btn">Gửi Login link</button>
      )}
      {error && <p>{error}</p>}
      {linkSent && <p>Check email và bấm vào link vừa nhận được nhé</p>}
    </form>
  );
}
