import React, { useEffect, useState } from "react";
import styles from './nav.module.css';
import { Home, SupervisedUserCircle, HighlightOff, ProductionQuantityLimits, QueryStats, Message } from '@mui/icons-material';
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import JwtService from "../../utils/jwtService";
import { getToken } from "../../utils/helpers";

const navConfig: any = [
  {
    label: "Chat",
    href: "/chat/0/",
    icon: <Message className={styles.iconNav} />,
    rolePermission: JwtService.isAsesor(getToken()) || JwtService.isAdministrator(getToken())
  },
  {
    label: "Leads de venta",
    href: "/leads",
    icon: <Message className={styles.iconNav} />,
    rolePermission: JwtService.isAsesor(getToken()) || JwtService.isAdministrator(getToken())
  },
  {
    label: "Usuarios",
    href: "/users",
    icon: <SupervisedUserCircle className={styles.iconNav} />,
    rolePermission: JwtService.isAdministrator(getToken())
  },
];



function Nav() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNav = (href: string) => {
    router.push(href);
  }

  const handleLogout = () => {
    localStorage.removeItem('tokenNetMarketDahsboard');
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  }

  return (
    <div className={styles.navContainer}>
      {isClient && <>
        <div className={styles.headerNav}>
          <img src="/logo.png" alt="logo" className={styles.logoNav}/>
          <h1 className={styles.titleHeaderNav}>Tec Movistar</h1>
        </div>

        {navConfig?.map((item:any, index:any) => (
          <>
            {item?.rolePermission === true && 
              <div className={styles.itemNavContainer} key={index} onClick={() => handleNav(item.href)}>
                {item.icon}
                <span className={styles.itemNavLabel}>{item.label}</span>
              </div>
            }
          </>
        ))}
        <div className={styles.itemNavContainerCloseSesion} onClick={handleLogout}>
            <HighlightOff className={styles.iconNav} />
            <span className={styles.itemNavLabel}>Cerrar sesión</span>
        </div>
      </>}
    </div>
  );
}

export default Nav;