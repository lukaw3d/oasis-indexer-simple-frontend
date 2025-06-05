import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes } from './pages/routes'
import './utils/polyfill'

axios.defaults.baseURL = import.meta.env.VITE_APP_INDEXER_API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  },
})

export const router = createHashRouter(routes)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <a href="#" style={{ float: 'left' }}>/</a>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
