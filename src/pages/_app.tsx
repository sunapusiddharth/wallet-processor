import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import '../styles/globals.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'


import type { AppProps } from 'next/app'
import { Fragment, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Modal from "../components/Modal";
import { Toaster } from 'react-hot-toast'
export default function App({ Component, pageProps, router }: AppProps) {



  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity
      }
    }
  }))

  return <QueryClientProvider client={queryClient}>
    <Toaster position="top-right" />
    <main className='m-4'>
      <Component {...pageProps} />
      {/* <Modal /> */}
    </main>
    <ReactQueryDevtools />
  </QueryClientProvider>
}
