'use client'

import { app } from '../firebase'
import { getDatabase, ref, onValue, get } from "firebase/database";

import { useState, useEffect } from 'react'
import EditUser from './admin';
import getActivePass from '../components/activepass';

var listings = [];

const db = getDatabase(app);

get(ref(db, 'purchase')).then((snapshot) => {
  if (snapshot.exists()) {
    listings = snapshot.val();
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

export default function Users() {
  const [users, setUsers] = useState({});
  const [passes, setPasses] = useState({});
  const [selectedUser, selectUser] = useState('');

  useEffect(() => {
    onValue(ref(db, 'users'), (snapshot) => {
      setUsers(snapshot.val());
    });

    onValue(ref(db, 'passes'), (snapshot) => {
      setPasses(snapshot.val());
    });
  }, []);

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

  function Pass({pass, isActive}) {
    return (
      <div className={`flex flex-wrap gap-x-2 px-2 pt-1 ${isActive ? 'bg-yellow-100' : ''}`}>
        <span className='whitespace-nowrap max-sm:grow'>
          {new Date(pass['purchasedOn']).toLocaleDateString('ru-ru', {day:'2-digit', month:'2-digit', year:'numeric', timeZone: 'UTC'})}
          {' - '}
          {pass['expiresOn'] < 253402214400000 ? 
            new Date(pass['expiresOn']).toLocaleDateString('ru-ru', {day:'2-digit', month:'2-digit', year:'numeric', timeZone: 'UTC'}) : 'INFINITE'
          }
        </span>
        <span className='font-bold grow max-sm:basis-full max-sm:order-first max-sm:text-center'>
          {pass['title']}
        </span>
        {passStatus(pass)}
      </div>
    )
  }

  function User({k, data}) {
    if (data.hasOwnProperty('role') && data['role'] === 'admin') {
      return null;
    }
    let activePass = '';
    if (passes.hasOwnProperty(k)) {
      const validPasses = Object.keys(passes[k])
        .filter((key) => (passes[k][key]["private"] == false))
        .filter((key) => (passes[k][key]['expiresOn'] > new Date().getTime()))
        .filter((key) => (passes[k][key]["sessions"] == undefined || Object.keys(passes[k][key]["sessions"]).length < passes[k][key]["amount"]));

      if (validPasses.length > 0) {
        activePass = validPasses[0];
      }
    }

    return (
      <div className='flex flex-wrap bg-white border-2 border-black rounded-xl p-2'>
        <span title={k} className='text-xl grow'>
          {data['name'].split(' ').reverse().join(' ')}
        </span>
        <button className='bg-white p-1 rounded-md hidden' disabled onClick={()=>(selectUser(k))}>
          <span className='bi bi-pencil-fill' />
        </button>
        <div className='basis-full flex flex-col divide-y divide-black'>
          {passes.hasOwnProperty(k) && Object.keys(passes[k])
            .sort((a, b) => (-1 * a.localeCompare(b)))
            .map((pass) => (
              <Pass key={pass} pass={passes[k][pass]} isActive={pass==activePass} />
            ))
          }
        </div>
      </div>
    )
  }
  
  return (
    <main className='relative flex flex-col text-left mx-4 mb-2 gap-2 sm:mx-auto sm:max-w-2xl'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПОЛЬЗОВАТЕЛИ
      </span>
      {Object.keys(users).sort((a,b) => (lastnameSort(users[a]['name'], users[b]['name']))).map((key) => (
        <User key={key} k={key} data={users[key]} />
      ))}
      <EditUser user={selectedUser} data={users} listings={listings} selectedUser={selectedUser} selectUser={selectUser} />
    </main>
  )
}

function lastnameSort(a, b) {
  return a.replace(/\s+/g, ' ').split(' ')[1]
    .localeCompare(b.replace(/\s+/g, ' ').split(' ')[1]);
}