import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "icon.svg" }
];
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-800 text-slate-50 font-light">
        <header className="w-full mx-auto px-4 lg:w-4/5 lg:px-0 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif font-bold text-2xl text-green-400">Utils Services</Link>
          <ul>
            <li><Link to="/access" className="font-light tracking-widest uppercase text-sm">Access Log</Link></li>
          </ul>
        </header>
        <div className="w-full mx-auto px-4 lg:w-4/5 lg:px-0 ">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
