'use client'

import './globals.css'
import { Neucha, Marck_Script } from 'next/font/google'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { useState, useEffect, createContext } from 'react'

import { app } from './firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import SideMenu from './components/sidemenu';

const neucha = Neucha({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--neucha-font' })
const marck = Marck_Script({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--marck-font' })

export const UserContext = createContext({});

export default function RootLayout({ children }) {
  const [sideMenu, setMenu] = useState(false);
  function toggleMenu() { setMenu(!sideMenu) };

  const [user, setUser] = useState(getAuth(app).currentUser);
  useEffect(() => {
    return onAuthStateChanged(getAuth(app), (u) => {
      setUser(u);
    });
  }, []);

  return (
    <html lang='ru' className={`${neucha.variable} ${marck.variable}`}>
      <head>
        <title>SanchosFit</title>
      </head>
      <body>
        <UserContext.Provider value={user}>
          <SideMenu sideMenu={sideMenu} toggleMenu={toggleMenu} user={user} />
          {children}
        </UserContext.Provider>
      </body>
    </html>
  )
}