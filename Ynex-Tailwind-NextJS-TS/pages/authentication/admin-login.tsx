// GloHorizon Admin Login

import React, { useState, useEffect } from 'react'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Seo from '@/shared/layout-components/seo/seo'
import { AuthService } from '@/shared/api/services/auth'
import { LoginRequest } from '@/shared/api/config'

const AdminLogin = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })

  // Check if already logged in
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      router.push('/glohorizon/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await AuthService.login(formData)
      
      if (response.success) {
        // Show success message briefly
        console.log('Login successful:', response.user.fullName)
        
        // Redirect to dashboard
        router.push('/glohorizon/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Fragment>
              <Seo title="Admin Login - Global Horizon Travel and Tour" />
      
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="my-[2.5rem] flex justify-center">
                <Link href="/glohorizon/dashboard">
                  <img src="../../../assets/images/brand-logos/desktop-logo.png" alt="GloHorizon Travel" className="desktop-logo" />
                  <img src="../../../assets/images/brand-logos/desktop-dark.png" alt="GloHorizon Travel" className="desktop-dark" />
                </Link>
              </div>
              
              <div className="box">
                <div className="box-body !p-[3rem]">
                  <div className="text-center mb-6">
                    <h4 className="text-[1.5rem] font-semibold mb-2">
                      GloHorizon Travel Admin 🌍
                    </h4>
                    <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">
                      Sign in to manage bookings and provide exceptional travel experiences
                    </p>
                  </div>

                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      <div className="flex items-center">
                        <i className="ri-error-warning-line text-[1rem] me-2"></i>
                        <div className="text-[0.875rem]">{error}</div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-y-4">
                      <div className="xl:col-span-12 col-span-12">
                        <label htmlFor="signin-username" className="form-label text-default">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          className="form-control form-control-lg w-full !rounded-md" 
                          id="signin-username"
                          name="email"
                          placeholder="admin@globalhorizonstravel.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="xl:col-span-12 col-span-12 mb-2">
                        <label htmlFor="signin-password" className="form-label text-default d-block">
                          Password
                          <Link href="/authentication/reset-password-basic" className="ltr:float-right rtl:float-left text-danger">
                            Forgot password?
                          </Link>
                        </label>
                        <div className="input-group">
                          <input 
                            type="password" 
                            className="form-control form-control-lg !rounded-s-md" 
                            id="signin-password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                          />
                          <button 
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0" 
                            type="button" 
                            id="button-addon2"
                            onClick={() => {
                              const input = document.getElementById('signin-password') as HTMLInputElement
                              input.type = input.type === 'password' ? 'text' : 'password'
                            }}>
                            <i className="ri-eye-off-line align-middle"></i>
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="form-check !ps-0">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              value="" 
                              id="defaultCheck1"
                            />
                            <label className="form-check-label text-[#8c9097] dark:text-white/50 font-normal" htmlFor="defaultCheck1">
                              Remember password?
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        <button 
                          type="submit"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full me-2"></div>
                              Signing In...
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  <div className="text-center mt-6">
                    <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                      For technical support, contact your system administrator
                    </p>
                  </div>

                  {/* Demo Credentials (remove in production) */}
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                    <div className="text-center">
                      <h6 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                        🚀 Demo Credentials
                      </h6>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p><strong>Email:</strong> admin@globalhorizonstravel.com</p>
                        <p><strong>Password:</strong> admin123</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData({
                            email: 'admin@globalhorizonstravel.com',
                            password: 'admin123'
                          })
                        }}
                        className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
                      >
                        Click to fill demo credentials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

AdminLogin.layout = "Authenticationlayout"

export default AdminLogin 