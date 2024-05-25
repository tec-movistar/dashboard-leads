import { useState, useEffect } from "react";
import './globals.css'
import { AppProps } from "next/app";
import Providers from "../store/providers";
import { Toaster } from "react-hot-toast";
import JwtService from "../utils/jwtService";
import { getToken } from "../utils/helpers";

function MyApp({ Component, pageProps }: AppProps) {

  const token = typeof window !== 'undefined' && localStorage.getItem('tokenTecMovistarDashboardLeads');

  useEffect(() => {
    const path = window.location.pathname;
    if (!token) {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    if (path === '/home') {
      if (JwtService.isAdministrator(getToken())) { 
        window.location.href = '/leads';
      }

      if (JwtService.isAsesor(getToken())) { 
        window.location.href = '/leads';
      }
    }
  }, [token]);

 return (
    <div>
      <Providers>
        <Component {...pageProps} session={pageProps.session} />
        <Toaster
          position="top-right"
          reverseOrder={false}
        />  
      </Providers>
    </div>
 );
}
export default MyApp;