// GloHorizon Travel Admin - Entry Point

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthService } from '@/shared/api/services/auth'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (AuthService.isAuthenticated()) {
      // User is authenticated, redirect to dashboard
      router.push('/glohorizon/dashboard')
    } else {
      // User is not authenticated, redirect to login
      router.push('/authentication/admin-login')
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">GloHorizon Travel Admin</h2>
        <p className="text-gray-600">Initializing your dashboard...</p>
      </div>
    </div>
  )
}

export default Home
