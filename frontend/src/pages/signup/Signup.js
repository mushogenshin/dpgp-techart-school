import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { Link } from "react-router-dom";

// styles
import styles from "./Signup.module.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isPending } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles["signup-form"]}>
      <h2>Đăng Ký Mới</h2>
      <small>
        Chỉ những ai chưa từng học một khoá nào bao giờ với "Dẫu Phải Giải Phẫu"
        (anatomy, sculpting, rigging, coding) mới cần đăng ký.
        <br />
        <br />
        Nếu đã từng học thì chỉ cần <Link to="/login">đăng nhập</Link>.
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
      <button type="submit" className="btn" disabled={isPending}>
        {isPending ? "Signing Up..." : "Ghi Danh"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
