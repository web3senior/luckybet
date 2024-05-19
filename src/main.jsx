import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.scss'
import './styles/global.scss'

import ErrorPage from './error-page'
import Loading from './routes/components/LoadingSpinner'
const Layout = lazy(() => import('./routes/layout.jsx'))
const UserLayout = lazy(() => import('./routes/user-layout.jsx'))
import Whitelist from './routes/whitelist.jsx'
import Pools from './routes/pools.jsx'
import New from './routes/new.jsx'
import Home, { loader as homeLoader } from './routes/home.jsx'
import Play, { loader as playLoader } from './routes/play.jsx'
import About from './routes/about.jsx'

console.log(`%c🆙`, 'font-size:5rem')

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home title={`Home`} />,
      },
      {
        path: 'play/:poolId',
        loader: playLoader,
        element: <Play title={`Play`} />,
      },
      {
        path: 'new',
        element: <New title={`New`} />,
      },
      {
        path: 'pools',
        element: <Pools title={`Pools`} />,
      },
      {
        path: 'about',
        element: <About title={`About`} />,
      },
      {
        path: 'whitelist',
        element: <Whitelist title={`Whitelist`} />,
      },
    ],
  },
  {
    path: 'usr',
    element: (
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <UserLayout />
        </AuthProvider>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: ':username',
    element: <></>,
  },
  // {
  //   path: "donate",
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="/" replace />,
  //     },
  //     {
  //       path: ":wallet_addr",
  //       element: <Donate title={`Donate`} />,
  //     },
  //   ],
  // },
])

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
