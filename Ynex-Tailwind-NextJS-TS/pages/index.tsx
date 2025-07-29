// GloHorizon Travel Admin - Entry Point

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    // For static export, redirect to login page
    router.replace('/authentication/admin-login')
  }, [router])

  // Show loading state while redirecting
  return (
    <>
      <Head>
        <title>GloHorizon Travel Admin</title>
        <meta httpEquiv="refresh" content="0; url=/authentication/admin-login" />
        <link rel="canonical" href="/authentication/admin-login" />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">GloHorizon Travel Admin</h2>
          <p className="text-gray-600">Redirecting to login...</p>
          <p className="text-sm text-gray-500 mt-2">
            If you are not redirected automatically, <a href="/authentication/admin-login" className="text-primary underline">click here</a>.
          </p>
        </div>
      </div>
    </>
  )
}

export default Home
