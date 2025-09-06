import type { Metadata } from "next";
import { Nunito_Sans, Poppins, Raleway } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const raleway = Raleway({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: [
    "200",
    "400",
    "500",
    "600",
    "700",
    "900"
  ]
})

export const metadata: Metadata = {
  title: "hubeleza | Painel",
  description: "hubeleza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${raleway.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
