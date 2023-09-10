'use client'

import { logout, database } from '../firebase'
import { ref, onValue } from "firebase/database";

import { useState, useEffect, useContext } from 'react'

import { UserContext } from '../layout';

export default function Profile() {
  const user = useContext(UserContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user) {
      const userNumber = user.email.split('@')[0];
      const userRef = ref(database, `users/${userNumber}`);

      return onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });
    }
  }, []);

  return (
    <main className='relative flex flex-col justify-items-center basis-full text-left px-2 sm:mx-auto inset-y-0 sm:max-w-2xl'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПРОФИЛЬ
      </span>
      <p className='text-xl sm:text-2xl text-center'>
        {userData.name}
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