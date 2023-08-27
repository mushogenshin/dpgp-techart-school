import { useState } from "react";
import { useEmailLinkLogin } from "../../hooks/auth/useEmailLinkLogin";

import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { sendSignInLink, error, isPending, linkSent } = useEmailLinkLogin();

  const handleSubmit = (event) => {
    event.preventDefault();
    sendSignInLink(email);
  };

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(
      emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles["login-form"]}>
      <h2>Đăng Nhập</h2>

      <ul>
        <li>
          Cựu học viên: nhập địa chỉ email mà bạn đã dùng khi ghi danh với Dẫu
          Phải Giải Phẫu (gesture, anatomy, sculpting, rigging, coding) trong
          quá khứ
        </li>
        <li>
          Khách lạ: những ai chưa từng học một khoá nào bao giờ với "Dẫu Phải
          Giải Phẫu" vẫn có thể đăng nhập để xem các tài liệu miễn phí 😌
        </li>
      </ul>

      <label>
        <span>Email:</span>
        <input type="email" onChange={handleEmailChange} value={email} />
      </label>

      <button
        type="submit"
        className="btn"
        disabled={isPending || !isEmailValid}
      >
        {isPending ? "Đang gửi..." : "Gửi Login link"}
      </button>

      {error && <p>{error}</p>}

      {linkSent && (
        <div className={styles.sent}>
          <p>Đã gửi Login link!</p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/login-instructions%2FGmail-threads-collapsed.jpg?alt=media&token=ca91abb2-1326-4d56-a64b-9b69d7342878"
            alt="Gmail-threads-collapsed"
          />
          <p>
            Vui lòng check email và bấm vào link bên trong email vừa nhận được
            để login
          </p>
        </div>
      )}
    </form>
  );
}
