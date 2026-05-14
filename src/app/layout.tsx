import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/layout/CartDrawer";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WIIMY | STORE",
  description:
    "Sublimación premium para la cultura geek. Ediciones limitadas, diseño editorial y calidad de estudio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${montserrat.variable}`}
    >
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
