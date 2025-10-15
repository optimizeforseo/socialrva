"use client";

import { ThemeProvider } from "../context/ThemeContext";

export default function ClientWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
