// Global Horizon Travel and Tour Admin Dashboard

import React, { useState, useEffect } from 'react'
import { Fragment } from 'react'
import Link from 'next/link'
import Seo from '@/shared/layout-components/seo/seo'
import { StatusBadge } from '@/shared/components/glohorizon/StatusBadge'
import { UrgencyBadge } from '@/shared/components/glohorizon/UrgencyBadge'
import { ServiceTypeBadge } from '@/shared/components/glohorizon/ServiceTypeBadge'
import { DashboardService, BookingService } from '@/shared/api'
import { BookingListItem, DashboardStats } from '@/shared/api/config'

// Set layout for this page
const GlobalHorizonDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<BookingListItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        // Load dashboard stats and recent bookings in parallel
        const [statsData, bookingsData] = await Promise.all([
          DashboardService.getDashboardStats(),
          BookingService.getBookings({ pageSize: 5, sortBy: 'createdAt', sortOrder: 'desc' })
        ])

        setDashboardData(statsData)
        setRecentBookings(bookingsData)
      } catch (err: any) {
        console.error('Dashboard data load error:', err)
        setError(err.message || 'Failed to load dashboard data')
        
        // Fallback to mock data if API fails
        const { dashboardCards, recentBookings: mockBookings } = await import('@/shared/data/dashboards/glohorizon-data')
        setRecentBookings(mockBookings)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  // Build dashboard cards from API data
  const getDashboardCards = () => {
    if (!dashboardData) {
      // Fallback to static cards while loading
      return [
        { title: 'Total Bookings', value: '...', icon: '📊', color: 'blue' },
        { title: 'Pending Review', value: '...', icon: '⏳', color: 'orange', urgent: true },
        { title: 'Completed', value: '...', icon: '✅', color: 'green' },
        { title: 'Total Customers', value: '...', icon: '👥', color: 'purple' }
      ]
    }

    return [
      {
        title: 'Total Bookings',
        value: dashboardData.totalBookings,
        icon: '📊',
        color: 'blue',
        trend: '+12% from last month',
        link: '/glohorizon/bookings'
      },
      {
        title: 'Pending Review',
        value: dashboardData.pendingBookings,
        icon: '⏳',
        color: 'orange',
        urgent: dashboardData.pendingBookings > 0,
        action: 'View Pending',
        link: '/glohorizon/bookings?status=1,2'
      },
      {
        title: 'Completed',
        value: dashboardData.completedBookings,
        icon: '✅',
        color: 'green',
        trend: '+8% from last month'
      },
      {
        title: 'Total Customers',
        value: dashboardData.totalUsers,
        icon: '👥',
        color: 'purple',
        trend: '+15 new this month'
      }
    ]
  }

  const dashboardCards = getDashboardCards()
  const urgentBookings = recentBookings.filter(b => [2, 3].includes(b.urgency) && [1, 2].includes(b.status))

  if (error && recentBookings.length === 0) {
    return (
      <Fragment>
        <Seo title="Global Horizon Travel and Tour - Dashboard" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Backend Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Make sure your Global Horizon Travel API is running at: 
              <code className="bg-gray-100 px-2 py-1 rounded ml-1">http://localhost:5080/api</code>
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="ti-btn bg-primary text-white"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Seo title="Global Horizon Travel and Tour - Dashboard" />
      
      {/* Page Header */}
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
            Welcome to Global Horizon Travel and Tour Admin! 🌍
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            Manage bookings, track performance, and provide exceptional travel experiences.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {loading ? 'Loading...' : `Last updated: ${currentTime.toLocaleString()}`}
            {error && <span className="text-red-500 ml-2">⚠️ Using offline data</span>}
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <Link href="/glohorizon/bookings?status=1,2" 
            className="ti-btn bg-orange-500 text-white btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none">
            <i className="ri-alarm-warning-line inline-block me-1"></i>
            Urgent ({urgentBookings.length})
          </Link>
          <Link href="/glohorizon/bookings" 
            className="ti-btn ti-btn-outline-primary btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none">
            <i className="ri-list-check-2 inline-block me-1"></i>
            All Bookings
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-x-6">
        
        {/* Stats Cards */}
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            {dashboardCards.map((card, index) => (
              <div key={index} className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                <div className={`box ${card.urgent ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' : ''}`}>
                  <div className="box-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-1">
                          {card.title}
                        </div>
                        <div className="text-[1.5625rem] font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                          {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                        </div>
                        {card.trend && (
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-1">
                            {card.trend}
                          </div>
                        )}
                        {card.action && card.link && (
                          <Link href={card.link} className="text-orange-600 text-[0.75rem] font-medium hover:underline mt-2 inline-block">
                            {card.action} →
                          </Link>
                        )}
                      </div>
                      <div className="text-3xl">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-12 col-span-12">
          <div className="box">
            <div className="box-header flex justify-between">
              <div className="box-title">Recent Bookings</div>
              <Link href="/glohorizon/bookings" className="text-primary text-[0.813rem] font-medium hover:underline">
                View All →
              </Link>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr className="border-b border-defaultborder">
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Reference
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Service
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Customer
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Status
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Priority
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Price
                      </th>
                      <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-b border-defaultborder">
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <Link href={`/glohorizon/bookings/${booking.id}`} className="text-primary font-mono text-[0.75rem] hover:underline">
                            {booking.referenceNumber}
                          </Link>
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <ServiceTypeBadge serviceType={booking.serviceType} size="sm" />
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <div>
                            <div className="text-[0.813rem] font-medium text-defaulttextcolor">
                              {booking.user?.fullName}
                            </div>
                            <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                              {booking.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <StatusBadge status={booking.status} size="sm" />
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <UrgencyBadge urgency={booking.urgency} size="sm" />
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <div className="text-[0.813rem] font-medium">
                            {booking.finalPrice 
                              ? formatCurrency(booking.finalPrice, booking.currency)
                              : booking.estimatedPrice 
                                ? `~${formatCurrency(booking.estimatedPrice, booking.currency)}`
                                : 'Pending'
                            }
                          </div>
                        </td>
                        <td className="!py-[0.75rem] !px-[1.25rem]">
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {getTimeAgo(booking.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Actions Sidebar */}
        <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-12 col-span-12">
          
          {/* Connection Status */}
          <div className="box mb-6">
            <div className="box-header">
              <div className="box-title">System Status</div>
            </div>
            <div className="box-body">
              <div className="text-center">
                {error ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                    <div className="text-red-600 font-medium mb-2">⚠️ Backend Offline</div>
                    <div className="text-sm text-red-600/70">Using cached data</div>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-2 ti-btn ti-btn-sm bg-red-500 text-white"
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                    <div className="text-green-600 font-medium mb-2">✅ Backend Connected</div>
                    <div className="text-sm text-green-600/70">Real-time data active</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Urgent Bookings */}
          <div className="box">
            <div className="box-header">
              <div className="box-title text-orange-600">
                🚨 Urgent Attention Required
              </div>
            </div>
            <div className="box-body">
              {urgentBookings.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-[2rem] mb-2">✅</div>
                  <div className="text-[0.875rem] text-[#8c9097] dark:text-white/50">
                    No urgent bookings at the moment
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {urgentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/glohorizon/bookings/${booking.id}`} className="text-[0.75rem] font-mono text-primary hover:underline">
                            {booking.referenceNumber}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <ServiceTypeBadge serviceType={booking.serviceType} size="sm" />
                            <UrgencyBadge urgency={booking.urgency} size="sm" />
                          </div>
                        </div>
                        <StatusBadge status={booking.status} size="sm" />
                      </div>
                      <div className="text-[0.75rem] text-defaulttextcolor font-medium">
                        {booking.user?.fullName}
                      </div>
                      <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {getTimeAgo(booking.createdAt)}
                      </div>
                    </div>
                  ))}
                  
                  <Link href="/glohorizon/bookings?urgency=2,3&status=1,2" 
                    className="block text-center py-2 text-orange-600 font-medium hover:underline">
                    View All Urgent Bookings →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </Fragment>
  )
}

GlobalHorizonDashboard.layout = "Contentlayout"

export default GlobalHorizonDashboard 