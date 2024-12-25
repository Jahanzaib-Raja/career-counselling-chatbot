import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Career Chatbot",
  description: "Get personalized career guidance from our AI-powered chatbot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Career Chatbot</title>
        <meta
          name="description"
          content="Get personalized career guidance from our AI-powered chatbot."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${inter.className} font-sans ${robotoMono.className} font-mono`}>
        {children}
      </body>
    </html>
  );
}