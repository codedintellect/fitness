'use client'

import './globals.css'
import { Neucha, Marck_Script } from 'next/font/google'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { usePathname } from 'next/navigation';
import Link from 'next/link'
import { useState } from 'react'

const neucha = Neucha({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--neucha-font' })
const marck = Marck_Script({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--marck-font' })

export default function RootLayout({ children }) {
  const [sideMenu, setMenu] = useState(false);
  function toggleMenu() {
    setMenu(!sideMenu);
  }
  return (
    <html lang='ru' className={`${neucha.variable} ${marck.variable}`}>
      <body>
        <SideMenu sideMenu={sideMenu} toggleMenu={toggleMenu} />
        {children}
      </body>
    </html>
  )
}

function SideMenu({sideMenu, toggleMenu}) {
  const options = [
    {
      name: 'О тренере Анжеле',
      path: '/'
    },
    {
      name: 'Запись на тренировки',
      path: '/schedule'
    },
    {
      name: 'Цены',
      path: '/prices'
    }
  ]
  return (
    <main className='fixed z-[100]'>
      <div style={{maxWidth: `${sideMenu * 768}px`}} className='fixed h-full border-r-2 border-black overflow-hidden transition-all duration-300'>
        <div className='relative h-full w-fit flex flex-col gap-2 bg-fallback whitespace-nowrap'>
          <span className='w-full text-4xl text-center font-bold mt-3'>
            Информация
          </span>
          <div className='grow flex flex-col gap-1 overflow-scroll px-2'>
            {
              options.map((item, index) => {
                return (
                  <PageSelector item={item} index={index} />
                )
              })
            }
          </div>
          <div className='flex flex-col gap-1 px-2 text-center'>
            <PageSelector item={{name: 'Авторизоваться', path: '/auth'}} index={999} />
          </div>
          <span className='text-2xl text-center font-medium'>
            @sanchos.fit
          </span>
        </div>
      </div>
      <button className='fixed m-2' onClick={toggleMenu}>
        <i className='bi bi-list text-4xl'></i>
      </button>
    </main>
  )
}

function PageSelector({item, index}) {
  let color = "bg-primary";
  if (usePathname() == item.path) {
    color = "bg-selection";
  }
  return (
    <Link key={index} href={item.path}>
      <div className={`w-full text-3xl ${color} px-3 border-2 border-black rounded-lg`}>
        {item.name}
      </div>
    </Link>
  )
}