'use client'

import { logout, database } from '../firebase'
import { ref, get, onValue, query, orderByChild, startAfter } from "firebase/database";

import { useState, useEffect, useContext } from 'react'

import { UserContext } from '../layout';
import getActivePass from '../components/activepass';
import Link from 'next/link';

export default function Profile() {
  const user = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [activePass, setActivePass] = useState('');
  const [visitHistory, setVisitHistory] = useState({});

  useEffect(() => {
    if (user) {
      const userNumber = user.uid;
      const userRef = ref(database, `users/${userNumber}`);

      return onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
        getActivePass(user.uid).then((x) => setActivePass(x));
        getVisitHistory(user.uid, setVisitHistory);
      });
    }
  }, []);

  return (
    <main className='relative flex flex-col gap-y-3 justify-items-center text-left px-2 sm:mx-auto sm:max-w-2xl'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПРОФИЛЬ
      </span>
      <p className='text-xl sm:text-2xl text-center'>
        {userData['name']}
      </p>
      <ActivePassDisplay userData={userData} activePass={activePass} />
      <VisitHistory visitHistory={visitHistory} />
      <PurchaseHistory userData={userData} />
      <button className='w-fit text-2xl bg-red-400 px-2 mx-auto my-2 border-2 border-black rounded-lg' onClick={logout}>
        выйти
      </button>
    </main>
  )
}

async function getVisitHistory(uid, callback) {
  let sessions = null;
  try {
    const lastMonth = new Date().setMonth(new Date().getMonth() - 1);
    const q = query(ref(database, 'sessions'), orderByChild('start'), startAfter(lastMonth));
    const snapshot = await get(q);
    if (!snapshot.exists()) {
      console.warn("No passes found");
      return null;
    }
    sessions = snapshot.val();
  }
  catch(error) {
    console.error(error);
    return null;
  }

  const attended = Object.keys(sessions)
    .filter((key) => (sessions[key].hasOwnProperty('attendees')))
    .filter((key) => (sessions[key]['attendees'].hasOwnProperty(uid)))
    .reduce( (res, key) => (res[key] = sessions[key], res), {} );
  
  //validPasses.sort((a, b) => passes[a]["expiresOn"] - passes[b]["expiresOn"]);

  callback(attended);
  return null;
}

function ActivePassDisplay({userData, activePass}) {
  if (!activePass) {
    return (
      <div className='relative bg-white border-2 border-black rounded-xl p-2 flex flex-row gap-x-2 items-center text-lg overflow-hidden'>
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
  const expiresSoon = activePassData['expiresOn'] < new Date().getTime() + 1000 * 60 * 60 * 24 * 7;
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
      <span className={`font-bold grow ${expiresSoon ? 'text-red-400' : ''}`}>
        {new Date(activePassData['expiresOn']).toLocaleDateString('ru-ru', {month: "long", day: "numeric", year:"numeric", timeZone: 'UTC'})}
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

function VisitHistory({visitHistory}) {
  if (Object.keys(visitHistory).length == 0) return null;

  return (
    <div className='bg-white border-2 border-black rounded-xl p-2 flex flex-row flex-wrap gap-x-2 items-center text-lg'>
      <span className='text-gray-700 basis-full'>
        История записей:
      </span>
      <div className='flex flex-col w-full divide-y divide-black'>
        {Object.keys(visitHistory).map((x) => (
          <div key={x} className='flex flex-wrap gap-x-2 pt-1'>
            <span className='max-sm:grow max-sm:flex-1'>
              {new Date(visitHistory[x]['start']).toLocaleDateString('ru-ru', {day:'2-digit', month:'2-digit', year:'numeric', timeZone: 'UTC'})}
            </span>
            <span className='max-sm:grow max-sm:text-center max-sm:flex-1'>
              {new Date(visitHistory[x]['start']).toLocaleTimeString('ru-ru', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})} - {new Date(visitHistory[x]['end']).toLocaleTimeString('ru-ru', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})}
            </span>
            <span className='font-bold grow max-sm:basis-full max-sm:order-first max-sm:text-center'>
              {visitHistory[x]['title']}
            </span>
            <div className='max-sm:grow max-sm:flex-1'>
              <button className={`float-right px-2 ${new Date().getTime() + 1000 * 60 * 60 * 3 >= visitHistory[x]['start'] ? 'bg-gray-200 text-fallback' : 'bg-red-400'} rounded-md`} disabled={new Date().getTime() + 1000 * 60 * 60 * 3 >= visitHistory[x]['start']}>
                отмена
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PurchaseHistory({userData}) {
  if (typeof(userData) != 'object' || !userData.hasOwnProperty('passes')) return;

  let passes = userData['passes']
  let purchases = Object.keys(passes).sort((a, b) => (passes[b]['purchasedOn'] - passes[a]['purchasedOn']));

  function passStatus(data) {
    if (data.hasOwnProperty('sessions') && Object.keys(data['sessions']).length == data['amount']) {
      return (
        <span className='font-bold text-gray-700'>
          ИСПОЛЬЗОВАН
        </span>
      )
    }
    else if (new Date().getTime() > data['expiresOn']) {
      return (
        <span className='font-bold text-red-400'>
          ИСТЁК
        </span>
      )
    }
    else {
      return (
        <span>
          {data.hasOwnProperty('sessions') ? Object.keys(data['sessions']).length : 0} / {data['amount']}
        </span>
      )
    }
  }

  return (
    <div className='bg-white border-2 border-black rounded-xl p-2 flex flex-row flex-wrap gap-x-2 items-center text-lg'>
      <span className='text-gray-700 basis-full'>
        История покупок:
      </span>
      <div className='flex flex-col w-full divide-y divide-black'>
        {purchases.map((x) => (
          <div key={x} className='flex flex-wrap gap-x-2 pt-1'>
            <span className='w-20 max-sm:grow'>
              {new Date(passes[x]['purchasedOn']).toLocaleDateString('ru-ru', {day:'2-digit', month:'2-digit', year:'numeric', timeZone: 'UTC'})}
            </span>
            <span className='font-bold grow max-sm:basis-full max-sm:order-first max-sm:text-center'>
              {passes[x]['title']}
            </span>
            {passStatus(passes[x])}
          </div>
        ))}
      </div>
    </div>
  )
}