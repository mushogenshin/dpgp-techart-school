// Desc: Admin panel for managing users, courses, and other resource.
// NOTE: this is accessible to all elevated roles (admin, collaborator, etc)

import { useAuthContext } from "../../hooks/auth/useAuthContext";
import GrantAccess from "./GrantAccess";
import QueryEnrollment from "./QueryEnrollment";
import InsertUnit from "./InsertUnit";
import InsertLesson from "./InsertLesson";
import DuplicateModule from "./DuplicateModule";

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
          <DuplicateModule />
          <InsertUnit />
          <InsertLesson />
        </div>
      ) : (
        <div className={styles.forbidden}>🥹 Access Denied</div>
      )}
    </div>
  );
}
