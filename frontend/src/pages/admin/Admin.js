// Desc: Admin panel for managing users, courses, and other resource.
// NOTE: this is accessible to all elevated roles (admin, collaborator, etc)

import { useState } from "react";
import { useGrantAccess } from "../../hooks/useGrantAccess";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Admin.module.css";

export default function Admin() {
  const { elevatedRole } = useAuthContext();

  return (
    <div className={styles.admin}>
      Your role: {elevatedRole.toUpperCase()}
      <hr></hr>
      {["admin", "collaborator"].includes(elevatedRole) ? (
        <div className={styles.admin}>
          <GrantAccess />
        </div>
      ) : (
        <div className={styles.forbidden}>🥹 Access Denied</div>
      )}
    </div>
  );
}

function GrantAccess() {
  const [collapsed, setCollapsed] = useState(true);
  const [emails, setEmails] = useState("");
  const [modules, setModules] = useState("");
  const { grantAccess, error, isPending, successList } = useGrantAccess();

  const handleModulesInput = (event) => {
    const sanitizedModules = event.target.value
      .replace(/[^\w\s,]/gi, "") // sanitize for special characters
      .replace(/[^\x00-\x7F]/g, ""); // remove non-ASCII characters

    setModules(sanitizedModules);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailArray = emails
      .split(",")
      .map((email) => email.trim().replace(/[^a-zA-Z0-9@._\-]/g, ""))
      .filter((email) => email !== "");

    const moduleArray = modules.split(",").map((mod) => mod.trim());

    grantAccess(emailArray, moduleArray);
  };

  const label = `${collapsed ? "👉" : "👇"} Cấp quyền học viên`;

  return (
    <div>
      <button
        className={styles.collapsible}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2>{label}</h2>
      </button>

      {!collapsed && (
        <form
          className={collapsed ? "" : styles.section}
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="emails">Email học viên:</label>
            <textarea
              id="emails"
              name="emails"
              value={emails}
              rows={5}
              onChange={(event) => {
                setEmails(event.target.value);
              }}
            />
            <small className={styles.hint}>
              (phân cách bằng dấu phẩy, chỉ thực hiện được với những học viên{" "}
              <br />
              <u>đã đăng nhập VÀ đã chuyển hệ thống</u>)
            </small>
          </div>

          <div>
            <label htmlFor="modules">Được xem các modules:</label>
            <input
              type="text"
              id="modules"
              name="modules"
              value={modules}
              onChange={handleModulesInput}
            />
            <small className={styles.hint}>
              (phân cách bằng dấu phẩy, sẽ cộng thêm vào danh sách hiện tại,{" "}
              <br />
              và tự động bỏ qua các đăng kí trùng lặp)
            </small>
          </div>

          <button type="submit" className="btn" disabled={isPending}>
            {isPending ? "Granting..." : "Cho phép"}
          </button>

          {error && <div className={styles.error}>{error}</div>}

          {successList.length > 0 && (
            <div className={styles.success}>
              <hr></hr>
              <h3>Đã cấp quyền xong:</h3>
              <ul>
                {successList.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
