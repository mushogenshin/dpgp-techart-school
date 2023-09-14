import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";

import { AuthContextProvider } from "./context/AuthContext";
import { CoursesContextProvider } from "./context/CoursesContext";
import { UsersContextProvider } from "./context/UsersContext";

import App from "./App";
import "./index.css";

// apollo client setup
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}`,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <UsersContextProvider>
      <CoursesContextProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </CoursesContextProvider>
    </UsersContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
