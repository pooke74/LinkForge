import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkForge — Your Links, Your Brand, One Page",
  description: "Create a beautiful, customizable link-in-bio page in seconds. Free forever. Share all your links with one URL.",
  keywords: ["link in bio", "linktree alternative", "bio link", "social links", "linkforge"],
  openGraph: {
    title: "LinkForge — Your Links, Your Brand, One Page",
    description: "Create a beautiful, customizable link-in-bio page in seconds. Free forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
