import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeContextProvider } from "./pages/context/ThemeContext";

const queryclient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryclient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeContextProvider>
  </StrictMode>
)