import { createContext, useReducer, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase_config";
import { onSnapshot, doc } from "firebase/firestore";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("Dispatching LOGIN");
      return { ...state, user: action.payload };
    case "LOGOUT":
      console.log("Dispatching LOGOUT");
      return { ...state, user: null, history: null, migrated: false };
    case "SET_HISTORY":
      console.log("Dispatching SET_HISTORY");
      return { ...state, history: action.payload };
    case "SET_MIGRATED":
      console.log("Dispatching SET_MIGRATED");
      return { ...state, migrated: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    history: null,
    migrated: false,
  });

  useEffect(() => {
    const auth = getAuth();
    let unsubHistory;
    let unsubMigrated;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });

        const historyRef = doc(db, "enrollments_migration", user.email);
        unsubHistory = onSnapshot(historyRef, (docSnapshot) => {
          const history = docSnapshot.exists()
            ? docSnapshot.data().enrollments
            : null;
          dispatch({ type: "SET_HISTORY", payload: history });
        });

        const migratedRef = doc(db, "users", user.uid);
        unsubMigrated = onSnapshot(migratedRef, (docSnapshot) => {
          dispatch({ type: "SET_MIGRATED", payload: docSnapshot.exists() });
        });

        return () => {
          unsubHistory();
          unsubMigrated();
          unsubAuth();
        };
      } else {
        if (unsubHistory) {
          unsubHistory();
        }

        if (unsubMigrated) {
          unsubMigrated();
        }

        dispatch({ type: "LOGOUT" });
      }
    });

    return () => {
      unsubAuth();
    };
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
