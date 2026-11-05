import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Software engineer and 3rd-year student at IIT Jodhpur. I build products like PacketWorld, wipe and EarlyFound, and contribute to LFortran.";

export const metadata: Metadata = {
  title: { default: "Atharva Waghmare", template: "%s · Atharva Waghmare" },
  description,
  openGraph: { title: "Atharva Waghmare", description, type: "website" },
  twitter: { card: "summary", title: "Atharva Waghmare", description },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 sm:px-6">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
