import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import { QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'


const queryclient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
<BrowserRouter>
<QueryClientProvider client={queryclient} >
 <App />
</QueryClientProvider>

</BrowserRouter>
   
  </StrictMode>
)
