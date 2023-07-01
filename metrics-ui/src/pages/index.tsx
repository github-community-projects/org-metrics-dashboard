import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import DarkModeToggle from '@/components/DarkModeToggle'
import Dashboard from '@/components/DashboardExample'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>WHO OS Metrics Dashboard</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center h-screen flex-col">
        <DarkModeToggle/>
        <Dashboard/>
      </main>
    </>
  )
}
