'use client'

import { logout, database } from '../firebase'
import { ref, onValue } from "firebase/database";

import { useState, useEffect, useContext } from 'react'

import { UserContext } from '../layout';
import getActivePass from '../components/activepass';
import Link from 'next/link';

export default function Profile() {
  const user = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [activePass, setActivePass] = useState('');

  useEffect(() => {
    if (user) {
      const userNumber = user.uid;
      const userRef = ref(database, `users/${userNumber}`);

      return onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
        getActivePass(user.uid).then((x) => setActivePass(x));
      });
    }
  }, []);

  return (
    <main className='relative flex flex-col justify-items-center basis-full text-left px-2 sm:mx-auto inset-y-0 sm:max-w-2xl'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПРОФИЛЬ
      </span>
      <p className='text-xl sm:text-2xl text-center mb-3'>
        {userData['name']}
      </p>
      <ActivePassDisplay userData={userData} activePass={activePass} />
      <button className='w-fit text-2xl bg-red-400 px-2 mx-auto my-2 border-2 border-black rounded-lg' onClick={logout}>
        выйти
      </button>
    </main>
  )
}

function ActivePassDisplay({userData, activePass}) {
  if (!activePass) {
    return (
      <div className='relative bg-white border-2 border-black rounded-xl p-2 flex flex-row flex-wrap gap-x-2 items-center text-lg overflow-hidden'>
        <span className='text-gray-700'>
          Действующий абонемент:
        </span>
        <span className='font-bold text-center'>
          НЕТ
        </span>
        <Link href='/prices' className='absolute right-0 bg-gray-300 p-6 rounded-l-full border-l-2 border-y-2 border-gray-400'>
          Приобрести
        </Link>
      </div>
    )
  }
  
  const activePassData = userData['passes'][activePass];
  return (
    <div className='bg-white border-2 border-black rounded-xl p-2 flex flex-row flex-wrap gap-x-2 items-center text-lg'>
      <span className='text-gray-700 basis-full'>
        Действующий абонемент:
      </span>
      <span className='font-bold basis-full text-center'>
        {activePassData['title']}
      </span>
      <span className='text-gray-700'>
        Годен до: 
      </span>
      <span className='font-bold grow'>
        {new Date(activePassData['expiresOn']).toLocaleDateString('ru-ru', {month: "long", day: "numeric", year:"numeric"})}
      </span>
      <span className='text-gray-700'>
        Посещений:
      </span>
      <span className='font-bold'>
        {activePassData['sessions'] ? Object.keys(activePassData['sessions']).length : 0} / {activePassData['amount']}
      </span>
    </div>
  )
}

function PurchaseHistory({}) {

}