// app/layout.js
// import React from "react";
// import "./globals.css";
// import { AuthContextProvider } from "./_utils/auth-context";

// export const metadata = {
//   title: "Tour Bus & Trips Scheduler",
//   description: "Schedule trips and tour buses for your company",
// };
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthContextProvider>{children}</AuthContextProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.js
"use client";
import { usePathname } from "next/navigation";
import React from "react";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";
import Sidebar from "./components/sidebar"; // Ensure you have the correct path

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current route

  // Check if the current route is sign-in or sign-out
  const isAuthPage = pathname === "/signin";

  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {!isAuthPage && <Sidebar />}{" "}
          {/* Render Sidebar only if not on auth pages */}
          <main style={{ marginLeft: !isAuthPage ? "250px" : "0px" }}>
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
