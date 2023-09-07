'use client'

import { logout } from '../firebase'

export default function Profile() {
  return (
    <main className='relative flex flex-col justify-items-center basis-full text-left px-2 sm:mx-auto inset-y-0 sm:max-w-2xl'>
      <h1 className='text-xl text-center sm:text-4xl mt-4 sm:mt-6'>
        Профиль
      </h1>
      <p className='text-xl sm:text-2xl text-center'>
        Имя Человека                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      </p>
      <div className='flex flex-row items-center'>
        TEMP
      </div>
      <button className='w-fit text-2xl bg-red-400 px-2 mx-auto my-2 border-2 border-black rounded-lg' onClick={logout}>
        выйти
      </button>
    </main>
  )
}