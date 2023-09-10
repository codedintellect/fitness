'use client'

import './globals.css'
import { Neucha, Marck_Script } from 'next/font/google'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { redirect, usePathname } from 'next/navigation';
import { useState, useEffect, createContext } from 'react'

import { auth } from './firebase'
import { onAuthStateChanged } from "firebase/auth";

import SideMenu from './components/sidemenu';

const neucha = Neucha({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--neucha-font' })
const marck = Marck_Script({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--marck-font' })

export const UserContext = createContext({});

export default function RootLayout({ children }) {
  const [sideMenu, setMenu] = useState(false);
  function toggleMenu() { setMenu(!sideMenu) };

  const [user, setUser] = useState(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  return (
    <html lang='ru' className={`${neucha.variable} ${marck.variable}`}>
      <body>
        <UserContext.Provider value={user}>
          <SideMenu sideMenu={sideMenu} toggleMenu={toggleMenu} user={user} />
          {children}
        </UserContext.Provider>
        <Transition user={user} />
      </body>
    </html>
  )
}

function Transition({user}) {
  if (user != null && usePathname() == '/auth') {
    return redirect('/schedule');
  }
  else if (user == null && usePathname() == '/profile') {
    return redirect('/auth');
  }
  return <></>;
}