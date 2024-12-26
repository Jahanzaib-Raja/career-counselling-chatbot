import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "AI-powered Career Counselling Chatbot",
  description: "Get personalized career guidance from our AI-powered chatbot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Career Counselling Chatbot</title>
        <meta
          name="description"
          content="Get personalized career guidance from our AI-powered chatbot."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph Meta Tags for WhatsApp and social media sharing */}
        <meta property="og:title" content="Career Counselling Chatbot" />
        <meta
          property="og:description"
          content="Get personalized career guidance from our AI-powered chatbot."
        />
        <meta property="og:image" content="../assests/logo/logoLight.png" />
        <meta property="og:url" content="https://careercounselling.up.railway.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags (optional for Twitter sharing) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Career Counselling Chatbot" />
        <meta
          name="twitter:description"
          content="Get personalized career guidance from our AI-powered chatbot."
        />
        <meta name="twitter:image" content="../assests/logo/logoLight.png" />
      </Head>
      <body className={`${inter.className} font-sans ${robotoMono.className} font-mono`}>
        {children}
      </body>
    </html>
  );
}
