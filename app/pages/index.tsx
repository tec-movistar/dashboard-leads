'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react'
import Login from '../components/Login/Login'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  


  return (
    <>
      <Login />
      <Toaster
          position="top-right"
          reverseOrder={false}
        />  
    </>
  )
}
