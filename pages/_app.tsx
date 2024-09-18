import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DevTools } from "jotai-devtools";
import Script from "next/script";
import localFont from "next/font/local";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import * as snippet from "@segment/snippet";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import Layout from "@/components/Layout";
import { VercelToolbar } from "@vercel/toolbar/next";

const queryClient = new QueryClient();

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY!,
    page: false,
  };

  if (process.env.NEXT_PUBLIC_ENV === "development") {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={NextAdapterPages}>
          <style jsx global>{`
            html {
              font-family: ${satoshi.style.fontFamily};
            }
          `}</style>
          <Layout>
            <Script
              id="segment-script"
              dangerouslySetInnerHTML={{ __html: renderSnippet() }}
            />
            <Component {...pageProps} />
            {process.env.NEXT_PUBLIC_ENV === "staging" && <VercelToolbar />}
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
          <DevTools />
        </QueryParamProvider>
      </QueryClientProvider>
      <Toaster />
    </div>
  );
}
