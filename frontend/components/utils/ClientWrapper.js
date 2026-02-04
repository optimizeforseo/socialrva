"use client";

import { ThemeProvider } from "../providers/ThemeProvider";
import { AuthProvider } from "../../context/AuthContext";

export default function ClientWrapper({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}