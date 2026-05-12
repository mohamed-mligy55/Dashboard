import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContextProvider } from "./pages/context/ThemeContext";
import { SidebarDrawerProvider } from "./pages/context/SidebarDrawerContext";
import RouteMeta from "./RouteMeta.jsx";

const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <RouteMeta />
        <SidebarDrawerProvider>
          <QueryClientProvider client={queryclient}>
            <App />
          </QueryClientProvider>
        </SidebarDrawerProvider>
      </BrowserRouter>
    </ThemeContextProvider>
  </StrictMode>
);