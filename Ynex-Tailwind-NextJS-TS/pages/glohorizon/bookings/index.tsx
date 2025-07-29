// Global Horizon Travel and Tour Bookings Management

import React, { useState, useEffect } from 'react'
import { Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Seo from '@/shared/layout-components/seo/seo'
import { StatusBadge } from '@/shared/components/glohorizon/StatusBadge'
import { UrgencyBadge } from '@/shared/components/glohorizon/UrgencyBadge'
import { ServiceTypeBadge } from '@/shared/components/glohorizon/ServiceTypeBadge'
import { 
  SERVICE_TYPES, 
  BOOKING_STATUSES, 
  URGENCY_LEVELS,
  BookingFilters
} from '@/shared/types/glohorizon'
import { BookingService } from '@/shared/api'
import { BookingListItem } from '@/shared/api/config'

const BookingsManagement = () => {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingListItem[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])
  
  // Filter states
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: [],
    serviceType: [],
    urgency: [],
    dateFrom: '',
    dateTo: '',
    page: 1,
    pageSize: 10
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage] = useState(10)
  
  // Parse URL params for filters
  useEffect(() => {
    const { status, serviceType, urgency, search } = router.query
    
    const newFilters: BookingFilters = {
      search: (search as string) || '',
      status: status ? (status as string).split(',').map(Number) : [],
      serviceType: serviceType ? (serviceType as string).split(',').map(Number) : [],
      urgency: urgency ? (urgency as string).split(',').map(Number) : [],
      dateFrom: '',
      dateTo: '',
      page: 1,
      pageSize: itemsPerPage
    }
    
    setFilters(newFilters)
  }, [router.query, itemsPerPage])

  // Load bookings from API
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        setError('')

        const apiFilters = {
          ...filters,
          page: currentPage,
          pageSize: itemsPerPage
        }

        const data = await BookingService.getBookings(apiFilters)
        setBookings(data)
        setFilteredBookings(data)
        
        // In a real API, you'd get total count from response
        setTotalCount(data.length)
      } catch (err: any) {
        console.error('Bookings load error:', err)
        setError(err.message || 'Failed to load bookings')
        
        // Fallback to mock data if API fails
        const { recentBookings } = await import('@/shared/data/dashboards/glohorizon-data')
        setBookings(recentBookings)
        setFilteredBookings(recentBookings)
        setTotalCount(recentBookings.length)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [filters, currentPage, itemsPerPage])

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

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(filteredBookings.map(b => b.id))
    } else {
      setSelectedBookings([])
    }
  }

  const handleSelectBooking = (bookingId: number, checked: boolean) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, bookingId])
    } else {
      setSelectedBookings(selectedBookings.filter(id => id !== bookingId))
    }
  }

  const clearFilters = () => {
    const clearedFilters: BookingFilters = {
      search: '',
      status: [],
      serviceType: [],
      urgency: [],
      dateFrom: '',
      dateTo: '',
      page: 1,
      pageSize: itemsPerPage
    }
    setFilters(clearedFilters)
    setCurrentPage(1)
    router.push('/glohorizon/bookings', undefined, { shallow: true })
  }

  const exportData = async () => {
    try {
      const blob = await BookingService.exportBookings(filters)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `glohorizon-bookings-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      // Fallback: Basic CSV export
      const headers = ['Reference', 'Service', 'Status', 'Customer', 'Price', 'Created']
      const rows = filteredBookings.map(booking => [
        booking.referenceNumber,
        SERVICE_TYPES[booking.serviceType as keyof typeof SERVICE_TYPES]?.name || 'Unknown',
        BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]?.name || 'Unknown',
        booking.user?.fullName || 'N/A',
        booking.finalPrice ? formatCurrency(booking.finalPrice, booking.currency) : 'Pending',
        new Date(booking.createdAt).toLocaleDateString()
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `glohorizon-bookings-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  if (error && bookings.length === 0) {
    return (
      <Fragment>
        <Seo title="Global Horizon Travel and Tour - Bookings Management" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Backend Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Make sure your GloHorizon API is running at: 
              <code className="bg-gray-100 px-2 py-1 rounded ml-1">http://localhost:5080/api</code>
            </p>
            <div className="space-x-2">
              <button 
                onClick={() => window.location.reload()} 
                className="ti-btn bg-primary text-white"
              >
                Retry Connection
              </button>
              <Link href="/glohorizon/dashboard" className="ti-btn ti-btn-outline-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Seo title="Global Horizon Travel and Tour - Bookings Management" />
      
      {/* Page Header */}
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
            Bookings Management 📋
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            Manage travel bookings, update statuses, and track customer requests.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {loading ? 'Loading...' : `Showing ${filteredBookings.length} of ${totalCount} bookings`}
            {error && <span className="text-red-500 ml-2">⚠️ Using offline data</span>}
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <button onClick={exportData}
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none">
            <i className="ri-download-line inline-block me-1"></i>
            Export CSV
          </button>
          <Link href="/glohorizon/dashboard" 
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none">
            <i className="ri-dashboard-line inline-block me-1"></i>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Connection Status Alert */}
      {error && (
        <div className="mb-6">
          <div className="alert alert-warning" role="alert">
            <div className="flex items-center">
              <i className="ri-wifi-off-line text-[1rem] me-2"></i>
              <div>
                <strong>Backend Connection Issues:</strong> {error}. Currently showing cached data.
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-2 text-orange-600 underline hover:text-orange-800"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-12 gap-x-6 mb-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Filters & Search</div>
              <button onClick={clearFilters} className="text-primary text-sm hover:underline">
                Clear All Filters
              </button>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                
                {/* Search */}
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12">
                  <label className="form-label text-sm font-medium">Search</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Reference, customer name, email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <div className="xl:col-span-2 lg:col-span-4 md:col-span-6 col-span-12">
                  <label className="form-label text-sm font-medium">Status</label>
                  <select multiple className="form-control" size={3}
                    value={filters.status?.map(String) || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => Number(option.value))
                      handleFilterChange('status', values)
                    }}>
                    {Object.entries(BOOKING_STATUSES).map(([id, status]) => (
                      <option key={id} value={id}>{status.name}</option>
                    ))}
                  </select>
                </div>

                {/* Service Type Filter */}
                <div className="xl:col-span-2 lg:col-span-4 md:col-span-6 col-span-12">
                  <label className="form-label text-sm font-medium">Service Type</label>
                  <select multiple className="form-control" size={3}
                    value={filters.serviceType?.map(String) || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => Number(option.value))
                      handleFilterChange('serviceType', values)
                    }}>
                    {Object.entries(SERVICE_TYPES).map(([id, service]) => (
                      <option key={id} value={id}>{service.name}</option>
                    ))}
                  </select>
                </div>

                {/* Urgency Filter */}
                <div className="xl:col-span-2 lg:col-span-4 md:col-span-6 col-span-12">
                  <label className="form-label text-sm font-medium">Priority</label>
                  <select multiple className="form-control" size={3}
                    value={filters.urgency?.map(String) || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => Number(option.value))
                      handleFilterChange('urgency', values)
                    }}>
                    {Object.entries(URGENCY_LEVELS).map(([id, urgency]) => (
                      <option key={id} value={id}>{urgency.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12">
                  <label className="form-label text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between">
              <div className="box-title">
                Bookings ({totalCount})
                {selectedBookings.length > 0 && (
                  <span className="ml-2 text-sm text-primary">
                    - {selectedBookings.length} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedBookings.length > 0 && (
                  <div className="flex gap-2">
                    <button className="ti-btn ti-btn-sm bg-orange-500 text-white">
                      Bulk Update Status
                    </button>
                    <button className="ti-btn ti-btn-sm ti-btn-outline-secondary">
                      Export Selected
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="box-body !p-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading bookings from API...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table whitespace-nowrap min-w-full">
                    <thead>
                      <tr className="border-b border-defaultborder">
                        <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                          <input 
                            type="checkbox" 
                            className="form-check-input"
                            checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
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
                          Created
                        </th>
                        <th scope="col" className="text-start !text-[0.85rem] !font-medium !text-defaulttextcolor !py-[0.75rem] !px-[1.25rem]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-8">
                            <div className="text-[2rem] mb-2">📭</div>
                            <p className="text-gray-500">No bookings found matching your filters</p>
                            <button onClick={clearFilters} className="text-primary hover:underline mt-2">
                              Clear filters to see all bookings
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-defaultborder hover:bg-gray-50">
                            <td className="!py-[0.75rem] !px-[1.25rem]">
                              <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={selectedBookings.includes(booking.id)}
                                onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                              />
                            </td>
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
                            <td className="!py-[0.75rem] !px-[1.25rem]">
                              <div className="flex items-center gap-2">
                                <Link href={`/glohorizon/bookings/${booking.id}`}
                                  className="ti-btn ti-btn-sm ti-btn-outline-primary">
                                  View
                                </Link>
                                <button className="ti-btn ti-btn-sm ti-btn-outline-secondary">
                                  Update
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="box-footer">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {endIndex} of {totalCount} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="ti-btn ti-btn-sm ti-btn-outline-primary disabled:opacity-50">
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`ti-btn ti-btn-sm ${
                              currentPage === pageNum 
                                ? 'bg-primary text-white'
                                : 'ti-btn-outline-primary'
                            }`}>
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ti-btn ti-btn-sm ti-btn-outline-primary disabled:opacity-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

BookingsManagement.layout = "Contentlayout"

export default BookingsManagement 