// Desc: Admin panel for managing users, courses, and other resource.
// NOTE: this is accessible to all elevated roles (admin, collaborator, etc)

import { useState } from "react";
import { useGrantAccess } from "../../hooks/useGrantAccess";

export default function GrantAccess() {
  const [emails, setEmails] = useState("");
  const [modules, setModules] = useState("");
  const { error, isPending, grantAccess } = useGrantAccess();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailArray = emails.split(",").map((email) => {
      return email.trim().replace(/[^a-zA-Z0-9@._\-]/g, "");
    });

    const sanitizedModules = modules
      .replace(/[^\w\s,]/gi, "") // sanitize for special characters
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII characters
      .trim(); // remove leading/trailing whitespace

    const moduleArray = sanitizedModules
      .split(",")
      .map((module) => module.trim());

    grantAccess(emailArray, moduleArray);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="emails">Emails:</label>
        <textarea
          id="emails"
          name="emails"
          value={emails}
          onChange={(event) => {
            setEmails(event.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="modules">Modules:</label>
        <input
          type="text"
          id="modules"
          name="modules"
          value={modules}
          onChange={(event) => {
            setModules(event.target.value);
          }}
        />
      </div>
      <button type="submit" className="btn" disabled={isPending}>
        {isPending ? "Granting..." : "Grant Access"}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}
