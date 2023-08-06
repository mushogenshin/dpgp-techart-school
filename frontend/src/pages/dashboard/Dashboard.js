import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={styles.dashboard}>
      <p>
        Đã đang đăng nhập 🙌.
        <br />
        <small>Account Email: {user.email}</small>
      </p>
      <div>
        <button className="btn" onClick={logout}>
          Sign Out
        </button>
      </div>
      <h2>Các khoá học đã ghi danh:</h2>
      TODO...
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <footer>Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu 🚀</footer>
    </div>
  );
}
