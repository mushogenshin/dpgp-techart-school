import { useState } from "react";
import { useGrantAccess } from "../../hooks/admin/useGrantAccess";

import styles from "./Admin.module.css";

export default function GrantAccess() {
  const [collapsed, setCollapsed] = useState(true);
  const [emails, setEmails] = useState("");
  const [modules, setModules] = useState("");
  const { grantAccess, error, isPending, successList } = useGrantAccess();

  const handleModulesInput = (event) => {
    const sanitizedModules = event.target.value
      .replace(/[^\w\s,]/gi, "") // sanitize for special characters
      .replace(/[^x00-\x7F,]/g, ""); // remove non-ASCII characters

    setModules(sanitizedModules);
  };

  const handleSubmit = async (event, target) => {
    event.preventDefault();
    const emailArray = emails
      .split(",")
      .map((email) => email.trim().replace(/[^a-zA-Z0-9@._-]/g, ""))
      .filter((email) => email !== "");

    const moduleArray = modules
      .split(",")
      .map((mod) => mod.trim())
      .filter((mod) => mod !== "");

    grantAccess(emailArray, moduleArray, target);
  };

  const label = `${collapsed ? "🚪" : "🚪🚪🚪"} Cấp quyền học viên`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        {label}
      </button>

      {!collapsed && (
        <div className={collapsed ? "" : styles.section}>
          <form>
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
              <u>đã đăng nhập VÀ đã chuyển hệ thống</u>)
            </small>

            <label htmlFor="modules">Các modules:</label>
            <input
              type="text"
              id="modules"
              name="modules"
              value={modules}
              onChange={handleModulesInput}
            />
            <small className={styles.hint}>
              (phân cách bằng dấu phẩy; lệnh "Cho Phép" sẽ cộng thêm vào danh
              sách hiện tại, và tự động bỏ qua các đăng kí trùng lặp)
            </small>

            <button
              type="submit"
              className="btn"
              onClick={(event) => handleSubmit(event, true)}
              disabled={isPending}
            >
              {isPending ? "Granting..." : "Cho phép"}
            </button>

            <button
              type="submit"
              className="btn"
              onClick={(event) => handleSubmit(event, false)}
              disabled={isPending}
            >
              {isPending ? "Removing..." : "Không cho phép"}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}

          {successList.length > 0 && (
            <div className={styles.success}>
              <hr></hr>
              <h3>Đã update access xong cho:</h3>
              <ul>
                {successList.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
