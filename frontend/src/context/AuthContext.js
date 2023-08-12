import { createContext, useReducer, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase_config";
import { onSnapshot, doc, query, collection, where } from "firebase/firestore";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("Dispatching LOGIN");
      return { ...state, user: action.payload };
    case "LOGOUT":
      console.log("Dispatching LOGOUT");
      return { ...state, user: null, enrollments: null };
    case "SET_ENROLLMENTS":
      console.log("Dispatching SET_ENROLLMENTS");
      return { ...state, enrollments: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    enrollments: null,
  });

  useEffect(() => {
    const auth = getAuth();
    let unsubFirestore;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });

        const enrollmentRef = doc(db, "enrollments_migration", user.email);

        unsubFirestore = onSnapshot(enrollmentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const enrollments = data.enrollments;

            dispatch({ type: "SET_ENROLLMENTS", payload: enrollments });
          } else {
            // User didn't have any enrollments prior to migration
          }
        });

        return () => {
          unsubFirestore();
          unsubAuth();
        };
      } else {
        if (unsubFirestore) {
          unsubFirestore();
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
