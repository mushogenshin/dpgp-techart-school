import { createContext, useReducer, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase_config";
import { onSnapshot, doc } from "firebase/firestore";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        pre_2023_07_history: null,
        post_2023_07_conformed: false,
        purchased: null,
        elevatedRole: null,
      };
    case "SET_HISTORY":
      return { ...state, pre_2023_07_history: action.payload };
    case "SET_CONFORMED":
      return { ...state, post_2023_07_conformed: action.payload };
    case "SET_PURCHASED":
      return { ...state, purchased: action.payload };
    case "SET_ADMIN":
      return { ...state, elevatedRole: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    pre_2023_07_history: null,
    post_2023_07_conformed: false,
    purchased: null,
    elevatedRole: null,
  });

  useEffect(() => {
    const auth = getAuth();

    // unsubscribe functions
    let unsubHistory;
    let unsubUser;
    let unsubAdmin;

    const handleAuthStateChange = (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });

        const historyRef = doc(db, "enrollments_migration", user.email);
        unsubHistory = onSnapshot(historyRef, (docSnapshot) => {
          dispatch({
            type: "SET_HISTORY",
            payload: docSnapshot.data(),
          });
        });

        const userRef = doc(db, "users", user.uid);
        unsubUser = onSnapshot(userRef, (docSnapshot) => {
          const conformed = docSnapshot.exists();
          const purchased = conformed ? docSnapshot.data().enrollments : null;
          dispatch({
            type: "SET_CONFORMED",
            payload: conformed,
          });
          dispatch({
            type: "SET_PURCHASED",
            payload: purchased,
          });
        });

        const adminRef = doc(db, "admins", user.uid);
        unsubAdmin = onSnapshot(adminRef, (docSnapshot) => {
          const elevatedRole = docSnapshot.exists()
            ? docSnapshot.data().role
            : null;
          dispatch({
            type: "SET_ADMIN",
            payload: elevatedRole,
          });
        });

        return () => {
          unsubHistory();
          unsubUser();
          unsubAdmin();
        };
      } else {
        if (unsubHistory) unsubHistory();
        if (unsubUser) unsubUser();
        if (unsubAdmin) unsubAdmin();
        dispatch({ type: "LOGOUT" });
      }
    };

    const unsubAuth = onAuthStateChanged(auth, handleAuthStateChange);

    return () => {
      unsubAuth();
    };
  }, []);

  // console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
