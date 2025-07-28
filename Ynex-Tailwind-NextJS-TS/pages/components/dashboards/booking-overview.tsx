// GloHorizon Booking Dashboard Overview

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Seo from '@/shared/layout-components/seo/seo';
import { gloHorizonApi, DashboardStats, Booking } from '@/shared/api';

const BookingOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard statistics
      const [bookingStats, payments, recentBookingsData] = await Promise.all([
        gloHorizonApi.bookings.getBookingStats(),
        gloHorizonApi.payments.getPaymentStats(),
        gloHorizonApi.bookings.getRecentBookings(5)
      ]);

      setStats({
        totalBookings: bookingStats.total,
        pendingBookings: bookingStats.pending,
        completedBookings: bookingStats.completed,
        totalRevenue: payments.totalRevenue,
        recentBookings: recentBookingsData,
        bookingTrends: [] // Will implement later with chart data
      });

      setRecentBookings(recentBookingsData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'cancelled': return 'text-danger bg-danger/10';
      case 'completed': return 'text-info bg-info/10';
      default: return 'text-secondary bg-secondary/10';
    }
  };

  const getUrgencyBadgeClass = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-danger bg-danger/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-info bg-info/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-secondary bg-secondary/10';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading && !stats) {
    return (
      <Fragment>
        <Seo title="GloHorizon Dashboard" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Seo title="GloHorizon Dashboard" />
      
      {/* Page Header */}
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
            Welcome to GloHorizon Travel Dashboard!
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            Track your travel bookings, payments, and customer activity here.
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <button 
            type="button"
            onClick={loadDashboardData}
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none"
          >
            <i className="ri-refresh-line inline-block me-1"></i>Refresh
          </button>
          <Link 
            href="/components/bookings/list"
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none"
          >
            <i className="ri-list-check inline-block me-1"></i>View All Bookings
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="ri-error-warning-line me-2"></i>
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-x-6">
        {/* Main Content Area */}
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            
            {/* Statistics Cards */}
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span className="!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-primary">
                        <i className="ti ti-calendar-event text-[1rem] text-white"></i>
                      </span>
                    </div>
                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">Total Bookings</p>
                          <h4 className="font-semibold text-[1.5rem] !mb-2">
                            {stats?.totalBookings || 0}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between !mt-1">
                        <div>
                          <Link className="text-primary text-[0.813rem]" href="/components/bookings/list">
                            View All<i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                          </Link>
                        </div>
                        <div className="text-end">
                          <p className="mb-0 text-success text-[0.813rem] font-semibold">+12%</p>
                          <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span className="!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-warning">
                        <i className="ti ti-clock-hour-4 text-[1rem] text-white"></i>
                      </span>
                    </div>
                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">Pending Bookings</p>
                          <h4 className="font-semibold text-[1.5rem] !mb-2">
                            {stats?.pendingBookings || 0}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <Link className="text-warning text-[0.813rem]" href="/components/bookings/list?status=pending">
                            View Pending<i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                          </Link>
                        </div>
                        <div className="text-end">
                          <p className="mb-0 text-warning text-[0.813rem] font-semibold">-5%</p>
                          <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span className="!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-success">
                        <i className="ti ti-check-circle text-[1rem] text-white"></i>
                      </span>
                    </div>
                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">Completed Bookings</p>
                          <h4 className="font-semibold text-[1.5rem] !mb-2">
                            {stats?.completedBookings || 0}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <Link className="text-success text-[0.813rem]" href="/components/bookings/list?status=completed">
                            View Completed<i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                          </Link>
                        </div>
                        <div className="text-end">
                          <p className="mb-0 text-success text-[0.813rem] font-semibold">+18%</p>
                          <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-body">
                  <div className="flex items-top justify-between">
                    <div>
                      <span className="!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-secondary">
                        <i className="ti ti-currency-dollar text-[1rem] text-white"></i>
                      </span>
                    </div>
                    <div className="flex-grow ms-4">
                      <div className="flex items-center justify-between flex-wrap">
                        <div>
                          <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">Total Revenue</p>
                          <h4 className="font-semibold text-[1.5rem] !mb-2">
                            {formatCurrency(stats?.totalRevenue || 0)}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <Link className="text-secondary text-[0.813rem]" href="/components/payments/list">
                            View Payments<i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                          </Link>
                        </div>
                        <div className="text-end">
                          <p className="mb-0 text-success text-[0.813rem] font-semibold">+25%</p>
                          <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">this month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Recent Bookings</div>
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href="/components/bookings/create"
                      className="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                    >
                      <i className="ri-add-line me-1"></i>New Booking
                    </Link>
                    <Link 
                      href="/components/bookings/list"
                      className="ti-btn ti-btn-outline-secondary !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                    >
                      View All<i className="ri-arrow-right-line ms-1"></i>
                    </Link>
                  </div>
                </div>
                <div className="box-body">
                  <div className="overflow-x-auto">
                    <table className="table min-w-full whitespace-nowrap table-hover border table-bordered">
                      <thead>
                        <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                          <th scope="col" className="!text-start !text-[0.85rem]">Booking ID</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Customer</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Destination</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Service</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Status</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Urgency</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Amount</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Date</th>
                          <th scope="col" className="!text-start !text-[0.85rem]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.length > 0 ? (
                          recentBookings.map((booking) => (
                            <tr key={booking.id} className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light">
                              <td className="font-semibold text-[0.813rem]">#{booking.id.slice(-6)}</td>
                              <td>
                                <div>
                                  <p className="font-semibold mb-0 text-[0.813rem]">{booking.contactName}</p>
                                  <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">{booking.contactEmail}</p>
                                </div>
                              </td>
                              <td className="text-[0.813rem]">{booking.destination}</td>
                              <td className="text-[0.813rem] capitalize">{booking.serviceType}</td>
                              <td>
                                <span className={`inline-flex !py-[0.15rem] !px-[0.45rem] rounded-sm !font-semibold !text-[0.75em] ${getStatusBadgeClass(booking.status)} capitalize`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td>
                                <span className={`inline-flex !py-[0.15rem] !px-[0.45rem] rounded-sm !font-semibold !text-[0.75em] ${getUrgencyBadgeClass(booking.urgency)} capitalize`}>
                                  {booking.urgency}
                                </span>
                              </td>
                              <td className="font-semibold text-[0.813rem]">
                                {formatCurrency(booking.totalAmount, booking.currency)}
                              </td>
                              <td className="text-[0.813rem]">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                                  <Link 
                                    href={`/components/bookings/details/${booking.id}`}
                                    className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary"
                                    aria-label="View booking details"
                                  >
                                    <i className="ri-eye-line"></i>
                                  </Link>
                                  <Link 
                                    href={`/components/bookings/edit/${booking.id}`}
                                    className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-success/10 text-success hover:bg-success hover:text-white hover:border-success"
                                    aria-label="Edit booking"
                                  >
                                    <i className="ri-edit-line"></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center py-8">
                              <div className="text-[#8c9097] dark:text-white/50">
                                {loading ? (
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                                    Loading bookings...
                                  </div>
                                ) : (
                                  <>
                                    <i className="ri-calendar-line text-4xl mb-2 block"></i>
                                    <p>No recent bookings found</p>
                                    <Link 
                                      href="/components/bookings/create"
                                      className="ti-btn ti-btn-primary mt-2"
                                    >
                                      Create First Booking
                                    </Link>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

BookingOverview.layout = "Contentlayout";
export default BookingOverview;