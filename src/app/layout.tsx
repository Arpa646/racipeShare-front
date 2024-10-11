import type { Metadata } from "next";
import "./globals.css";
import Providers from "./lib/Providers";
import { Providerss } from "@/GlobalRedux/provider";

export const metadata: Metadata = {
  title: "Apollo Gears",
  description: "Next Level Riding Sharing Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Apollo Gears</title>
        {/* Add the favicon link here */}
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://wpbingosite.com/wordpress/flacio/wp-content/uploads/2021/12/slider-10-1.jpg"
        />
      </head>
      <body className={`antialiased`}>
        <Providerss>
          <Providers>
            <div className="mx-auto container">{children}</div>
          </Providers>
        </Providerss>
      </body>
    </html>
  );
}
