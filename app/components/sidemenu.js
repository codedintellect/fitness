import Link from 'next/link'

import { usePathname } from 'next/navigation';
import { useContext } from 'react';

import { UserContext } from '../layout';

export default function SideMenu({sideMenu, toggleMenu}) {
  const user = useContext(UserContext);
  const options = [
    {
      name: 'О тренере Анжеле',
      path: '/'
    },
    {
      name: 'Запись на тренировки',
      path: '/schedule/'
    },
    {
      name: 'Адрес зала',
      path: '/location/'
    },
    {
      name: 'Цены',
      path: '/prices/'
    },
    {
      name: 'Вопросы',
      path: '/questions/'
    }
  ]
  const adminPages = [
    {
      name: 'Тренировки',
      path: '/scheduling/'
    },
    {
      name: 'Пользователи',
      path: '/users/'
    }
  ]
  return (
    <main className='fixed z-[100]'>
      <div style={{maxWidth: `${sideMenu * 768}px`}} className='fixed h-full border-r-2 border-black overflow-hidden transition-all duration-300'>
        <div className='relative h-full w-fit flex flex-col gap-2 bg-fallback whitespace-nowrap'>
          <div className='absolute bottom-0 opacity-50'>
            <img src='/sidebg.jpg' />
            <div className='absolute top-0 w-full h-20 bg-gradient-to-b from-fallback to-transparent'></div>
          </div>
          <span className='w-full text-4xl text-center font-bold mt-3 z-10'>
            Информация
          </span>
          <div className='grow flex flex-col gap-1 overflow-y-scroll px-2 z-[1]'>
            {
              options.map((item, index) => {
                return (
                  <PageSelector item={item} key={index} />
                )
              })
            }
          </div>
          <div className='flex flex-col gap-1 px-2 text-center z-[1]'>
            {/* HARD CODED = BAD! */}
            {(user!=null && user.uid==='1x7zq7YzJlZI6UNLI5hmwJBgKA43') &&
              adminPages.map((item, index) => (
                <AdminPage item={item} key={`admin${index}`} />
              ))
            }
            {user==null && <PageSelector item={{name: 'Авторизоваться', path: '/auth/'}} key={999} />}
            {user!=null && <PageSelector item={{name: 'Профиль', path: '/profile/'}} key={999} />}
          </div>
          <span className='text-2xl text-center font-medium z-[1]'>
            @sanchos.fit
          </span>
        </div>
      </div>
      <div className={`fixed inset-0 backdrop-blur-sm bg-black/10 z-[-1] ${sideMenu ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-300 xl:hidden`} onClick={toggleMenu}></div>
      <button className='fixed m-2' onClick={toggleMenu}>
        <i className='bi bi-list text-4xl'></i>
      </button>
    </main>
  )

  function AdminPage({item}) {
    let color = "bg-red-300";
    if (usePathname() == item.path) {
      color = "bg-red-500";
    }
    return (
      <Link href={item.path}>
        <div className={`w-full text-3xl ${color} px-3 border-2 border-black rounded-lg`} onClick={toggleMenu}>
          {item.name}
        </div>
      </Link>
    )
  }

  function PageSelector({item}) {
    let color = "bg-primary";
    if (usePathname() == item.path) {
      color = "bg-selection";
    }
    return (
      <Link href={item.path}>
        <div className={`w-full text-3xl ${color} px-3 border-2 border-black rounded-lg`} onClick={toggleMenu}>
          {item.name}
        </div>
      </Link>
    )
  }
}