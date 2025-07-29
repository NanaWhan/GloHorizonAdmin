import React from 'react'
import Head from "next/head";

const Seo = ({ title }:any) => {

  let i = `Global Horizon Travel - ${title}`

  return (
    <Head>
      <title>{i}</title>
      <link href="/favicon.ico" rel="icon"></link>
      <meta name="description" content="Global Horizon Travel and Tour - Professional Travel Booking Management System" />
      <meta name="author" content="ZediTech" />
      <meta name="keywords" content="travel booking, travel management, admin dashboard, booking system, travel admin, nextjs, typescript, tailwind, travel agency, tour management"></meta>
    </Head>
  )
}

export default Seo;