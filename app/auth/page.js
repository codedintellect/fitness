'use client'

import { login } from '../firebase'

export default function Auth() {
  return (
    <main className='flex flex-col justify-items-center text-left sm:mx-auto sm:max-w-2xl'>
      <div className='flex flex-col gap-2 mx-6 sm:mx-auto my-6 sm:w-96'>
        <input id='phonenumber' className='w-full p-2 border-2 border-black rounded-lg' type='tel'>
        
        </input>
        <input id='password' className='w-full p-2 border-2 border-black rounded-lg' type='password'>
        
        </input>
        <button className='w-fit px-4 py-1 mx-auto bg-white border-2 border-black rounded-lg' onClick={submit}>
          ВОЙТИ
        </button>
      </div>
    </main>
  )
}

function submit() {
  let phonenumber = document.getElementById('phonenumber').value;
  let password = document.getElementById('password').value;

  login(phonenumber, password);
}