// Desc: Admin panel for managing users, courses, and other resource.
// NOTE: this is accessible to all elevated roles (admin, collaborator, etc)

import { useAuthContext } from "../../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { useGrantAccess } from "../../hooks/useGrantAccess";

import styles from "./Admin.module.css";

export default function Admin() {
  const { elevatedRole } = useAuthContext();

  return (
    <div className={styles.admin}>
      Your role: {elevatedRole.toUpperCase()}
      <hr></hr>
      <GrantAccess />
    </div>
  );
}

function GrantAccess() {
  const [email, setEmail] = useState("");
  const [modules, setModules] = useState([]);
  const { grantAccess, error } = useGrantAccess();

  const handleSubmit = (e) => {
    e.preventDefault();
    grantAccess(email, modules);
  };

  const handleModuleInput = (e) => {
    const sanitizedString = e.target.value
      .replace(/[^\w\s,]/gi, "") // sanitize for special characters
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII characters
      .trim(); // remove leading/trailing whitespace

    const moduleArray = sanitizedString
      .split(",")
      .map((module) => module.trim());

    setModules(moduleArray);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🥊 Cấp quyền học viên</h2>
      <label>
        <span>Email học viên:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Được xem các modules:</span>
        <input onChange={handleModuleInput} value={modules.join(", ")} />
        <small>
          (phân cách bằng dấu phẩy, sẽ cộng thêm vào danh sách hiện tại,
          <br />
          và tự động bỏ qua các đăng kí trùng lặp)
        </small>
      </label>
      <button className="btn">Cho Phép</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
