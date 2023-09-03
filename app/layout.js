'use client'

import './globals.css'
import { Caveat, Marck_Script } from 'next/font/google'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { usePathname } from 'next/navigation';
import Link from 'next/link'

const caveat = Caveat({ subsets: ['latin', 'cyrillic'], variable: '--caveat-font' })
const marck = Marck_Script({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--marck-font' })

export default function RootLayout({ children }) {
  return (
    <html lang='ru' className={`${caveat.variable} ${marck.variable}`}>
      <body>
        <SideMenu />
        {children}
      </body>
    </html>
  )
}

function SideMenu() {
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
    <main className='fixed'>
      <div className='fixed h-full border-r-2 border-black'>
        <div className='relative h-full flex flex-col gap-2 bg-fallback'>
          <span className='text-4xl text-center font-bold mx-10'>
            Информация
          </span>
          <div className='grow flex flex-col gap-1 overflow-scroll px-2'>
            {
              options.map((item, index) => {
                return (
                  <Link key={index} href={item.path}>
                    <div className={`w-full text-3xl text-left ${usePathname() == item.path ? "bg-selection" : "bg-primary"} px-3 border-2 border-black rounded-lg`}>
                      {item.name}
                    </div>
                  </Link>
                )
              })
            }
          </div>
          <span className='text-2xl text-center font-medium'>
            @sanchos.fit
          </span>
        </div>
      </div>
      <button className='fixed'>
        <i className='bi bi-list text-4xl'></i>
      </button>
    </main>
  )
}