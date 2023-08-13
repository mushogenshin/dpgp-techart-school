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
      return { ...state, user: null, history: null, conformed: false };
    case "SET_HISTORY":
      console.log("Dispatching SET_HISTORY");
      return { ...state, history: action.payload };
    case "SET_CONFORMED":
      console.log("Dispatching SET_CONFORMED");
      return { ...state, conformed: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    history: null,
    conformed: false,
  });

  useEffect(() => {
    const auth = getAuth();

    // unsubscribe functions
    let unsubHistory;
    let unsubUser;

    const handleAuthStateChange = (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });

        const historyRef = doc(db, "enrollments_migration", user.email);
        unsubHistory = onSnapshot(historyRef, (docSnapshot) => {
          const history = docSnapshot.exists()
            ? docSnapshot.data().enrollments
            : null;
          dispatch({ type: "SET_HISTORY", payload: history });
        });

        const userRef = doc(db, "users", user.uid);
        unsubUser = onSnapshot(userRef, (docSnapshot) => {
          dispatch({ type: "SET_CONFORMED", payload: docSnapshot.exists() });
        });

        return () => {
          unsubHistory();
          unsubUser();
        };
      } else {
        if (unsubHistory) unsubHistory();
        if (unsubUser) unsubUser();
        dispatch({ type: "LOGOUT" });
      }
    };

    const unsubAuth = onAuthStateChanged(auth, handleAuthStateChange);

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
