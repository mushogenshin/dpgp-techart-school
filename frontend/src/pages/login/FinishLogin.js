import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

import styles from "./Login.module.css";

export default function FinishLogin() {
  const [verifyError, setVerifyError] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Nhập địa chỉ email dùng để đăng nhập");
        // console.log(
        //   `Using input email address "${email}" for sign-in verification`
        // );
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          setVerifyError(null);
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
          setVerifyError(error.message);
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <div className={styles["finish-login"]}>
      {verifyError && (
        <div>
          <p>
            Bị lỗi rồi 😰: <span className={styles.error}>{verifyError}</span>
          </p>
          <p>
            Lỗi này có thể do:
            <ol>
              <li>link đã hết hạn</li>
              <li>
                bấm yêu cầu gửi link từ thiết bị A nhưng sau đó lại mở link ở
                thiết bị B
              </li>
            </ol>
          </p>
          Vui lòng thử đăng nhập lại
        </div>
      )}
    </div>
  );
}
