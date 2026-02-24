import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HaziriHub Admin Dashboard",
  description: "Admin dashboard for managing HaziriHub users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900">
        {children}
      </body>
    </html>
  );
}
