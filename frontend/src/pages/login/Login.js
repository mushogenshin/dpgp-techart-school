import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

// styles
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles["login-form"]}>
      <h2>Đăng Nhập</h2>
      <small>
        Nhập địa chỉ email mà bạn đã dùng để đăng kí với Dẫu Phải Giải Phẫu
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
      <label>
        <span>Password:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      {/* prevent multiple requests during pending */}
      {isPending ? (
        <button className="btn" disabled>
          Loading
        </button>
      ) : (
        <button className="btn">Login</button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
