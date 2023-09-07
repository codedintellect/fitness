'use client'

import { login } from '../firebase'

export default function Auth() {
  return (
    <main className='relative flex flex-col justify-center h-full sm:mx-auto sm:max-w-2xl'>
      <span className='text-4xl text-center'>
        Авторизоваться
      </span>
      <div className='flex flex-col gap-2 mx-6 sm:mx-auto my-6 sm:w-96'>
        <input id='phonenumber' className='w-full text-xl text-center p-1 border-2 border-black rounded-lg' />
        <input id='password' className='w-full text-xl text-center p-1 border-2 border-black rounded-lg' type='password' />
        <input className='w-fit text-xl text-center px-4 py-1 mx-auto bg-white border-2 border-black rounded-lg' type='button' value='войти' onClick={submit} />
      </div>
    </main>
  )
}

function submit() {
  let phonenumber = document.getElementById('phonenumber').value;
  let password = document.getElementById('password').value;

  login(phonenumber, password);
}