// Desc: Admin panel for managing users, courses, and other resource.
// NOTE: this is accessible to all elevated roles (admin, collaborator, etc)

import { useAuthContext } from "../../hooks/useAuthContext";
import GrantAccess from "./GrantAccess";
import QueryEnrollment from "./QueryEnrollment";
import InsertContentBlock from "./InsertContentBlock";

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
          <QueryEnrollment />
          <InsertContentBlock />
        </div>
      ) : (
        <div className={styles.forbidden}>🥹 Access Denied</div>
      )}
    </div>
  );
}
