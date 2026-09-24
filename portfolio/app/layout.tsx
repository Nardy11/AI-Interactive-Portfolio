import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

// Display: Archivo — engineered, tight, holds a big headline without decoration.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Body: Inter — quiet at the small sizes the content sections use.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Utility: IBM Plex Mono — eyebrows, readouts, labels.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nardy Attalla — Software & ML Engineer",
  description: "Portfolio of Nardy Attalla: full-stack engineering, machine learning and computer vision. Browse it normally, by hand gesture, or by asking the assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

      </body>

    </html>
  );
}
