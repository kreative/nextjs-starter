import React, { ReactNode, useEffect } from "react";
import Router from "next/router";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout(props: LayoutProps) {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url) {
        // @ts-ignore
        global.analytics.page(url);
      }
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return <div>{props.children}</div>;
}
