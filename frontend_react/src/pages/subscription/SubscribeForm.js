import { useAuthContext } from "../../hooks/auth/useAuthContext";

/**
 * Form for subscribing to email updates for non-logged in users
 */
export default function SubscribeForm() {
  const { user } = useAuthContext();
  if (user) {
    return null;
  }

  return <div>TODO: Subscribe Form</div>;
}
