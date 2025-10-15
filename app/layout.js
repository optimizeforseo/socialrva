import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";

export const metadata = {
  title: "Socialrva - AI-Powered Social Media Management",
  description: "Create hyper-personalized LinkedIn content with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="transition-colors duration-300">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
