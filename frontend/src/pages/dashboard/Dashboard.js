import React from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div>
      <h2>DASHBOARD</h2>
      <p>Account Email: {user.email}</p>
      <button className="btn" onClick={logout}>
        Logout
      </button>
      <div>Hey you...</div>
    </div>
  );
}
