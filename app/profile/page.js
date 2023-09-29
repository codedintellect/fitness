'use client'

import { Cancel } from '../schedule/page'

import { app } from '../firebase'
import { getDatabase, ref, get, onValue, query, orderByChild, startAfter } from "firebase/database";
import { getAuth, signOut } from 'firebase/auth';

import { useState, useEffect, useContext } from 'react'

import { UserContext } from '../layout';
import getActivePass from '../components/activepass';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const db = getDatabase(app);

export default function Profile() {
  const user = useContext(UserContext);
  const [userPasses, setUserPasses] = useState({});
  const [activePass, setActivePass] = useState('');
  const [visitHistory, setVisitHistory] = useState({});
  const [username, setUsername] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `passes/${user.uid}`);

      return onValue(userRef, (snapshot) => {
        setUserPasses(snapshot.val());
        getActivePass(user.uid).then((x) => setActivePass(x));
        getVisitHistory(user.uid, snapshot.val(), setVisitHistory);
        getUsername(user.uid, setUsername);
      });
    }
  }, [user]);

  return (
    <main className='relative flex flex-col gap-y-3 justify-items-center text-left px-2 sm:mx-auto sm:max-w-2xl'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПРОФИЛЬ
      </span>
      <p className='text-xl sm:text-2xl text-center'>
        {username}
      </p>
      <ActivePassDisplay userPasses={userPasses} activePass={activePass} />
      <VisitHistory visitHistory={visitHistory} user={user} />
      <PurchaseHistory passes={userPasses} />
      <button className='w-fit text-2xl bg-red-400 px-2 mx-auto my-2 border-2 border-black rounded-lg' onClick={()=>logout(router)}>
        выйти
      </button>
    </main>
  )
}

async function getUsername(uid, callback) {
  try {
    const snapshot = await get(ref(db, `users/${uid}/name`));
    if (!snapshot.exists()) {
      console.warn("No passes found");
      return null;
    }
    callback(snapshot.val());
  }
  catch(error) {
    console.error(error);
    return null;
  }

  return null;
}

async function getVisitHistory(uid, passes, callback) {
  let sessions = null;
  try {
    const lastMonth = new Date().setMonth(new Date().getMonth() - 1);
    const q = query(ref(db, 'sessions'), orderByChild('start'), startAfter(lastMonth));
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

  let attended = Object.keys(sessions)
    .filter((key) => (sessions[key].hasOwnProperty('attendees')))
    .filter((key) => (sessions[key]['attendees'].hasOwnProperty(uid)))
    .reduce( (res, key) => (res[key] = sessions[key], res), {} );

  for (let k of Object.keys(passes)) {
    if (passes[k]["private"] && passes[k].hasOwnProperty("sessions")) {
      for (let s of Object.keys(passes[k]["sessions"])) {
        attended[s] = passes[k]["sessions"][s];
      }
    }
  }
  
  attended = Object.keys(attended)
    .sort((a, b) => attended[b]["start"] - attended[a]["start"])
    .reduce( (res, key) => (res[key] = attended[key], res), {} );

  callback(attended);
  return null;
}

function ActivePassDisplay({userPasses, activePass}) {
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

  const activePassData = userPasses[activePass];
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
        {activePassData['expiresOn'] < 253402214400000 ? new Date(activePassData['expiresOn']).toLocaleDateString('ru-ru', {month: "long", day: "numeric", year:"numeric", timeZone: 'UTC'}) : 'БЕССРОЧЕН'}
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

function VisitHistory({visitHistory, user}) {
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
            <div className='max-sm:grow max-sm:flex-1' hidden={!visitHistory[x].hasOwnProperty("attendees")}>
              <button className={`float-right px-2 ${new Date().getTime() + 1000 * 60 * 60 * 3 >= visitHistory[x]['start'] ? 'bg-gray-200 text-fallback' : 'bg-red-400'} rounded-md`} disabled={new Date().getTime() + 1000 * 60 * 60 * 3 >= visitHistory[x]['start']} onClick={() => Cancel(x, user, visitHistory)}>
                отмена
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PurchaseHistory({passes}) {
  if (!passes) return;
  
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

function logout(router) {
  console.log("run");
  signOut(getAuth(app)).then(()=>{
    console.log("test");
    router.push('/auth/');
  }).catch((error)=>{
    console.error(error);
  })
}