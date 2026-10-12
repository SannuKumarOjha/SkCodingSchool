import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "sonner";
import { UserProvider } from "./Pages/Navbar/context/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
        <Toaster />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();