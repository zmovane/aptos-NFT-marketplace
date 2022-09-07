import "../styles/globals.css";
import { NavBar } from "../components/NavBar";
import type { AppProps } from "next/app";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="px-8">
      <NavBar />
      <Component {...pageProps} className="bg-base-300" />
    </div>
  );
}

export default MyApp;
