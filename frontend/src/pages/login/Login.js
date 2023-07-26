import { useState } from "react";
import { useEmailLinkLogin } from "../../hooks/useEmailLinkLogin";

// styles
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const { sendSignInLink, error, isPending, linkSent } = useEmailLinkLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendSignInLink(email);
  };

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
      {linkSent && (
        <p>
          Check email và bấm vào link bên trong email vừa nhận được để login
        </p>
      )}
    </form>
  );
}
