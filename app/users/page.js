'use client'

import { app } from '../firebase'
import { getDatabase, ref, onValue, get } from "firebase/database";

import { useState, useEffect } from 'react'
import EditUser from './admin';

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
  const [selectedUser, selectUser] = useState('');

  useEffect(() => {
    const usersRef = ref(db, `users`);

    return onValue(usersRef, (snapshot) => {
      setUsers(snapshot.val());
    });
  }, []);

  function User({k, data}) {
    return (
      <div className='flex'>
        <span className='text-xl basis-full'>
          {data['name']}
        </span>
        <button className='bg-white p-1 rounded-md' onClick={()=>(selectUser(k))}>
          <span className='bi bi-pencil-fill' />
        </button>
      </div>
    )
  }
  
  return (
    <main className='relative flex flex-col text-left mx-4 mb-10 sm:mx-auto sm:max-w-2xl h-full'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ПОЛЬЗОВАТЕЛИ
      </span>
      {Object.keys(users).map((key) => (
        <User key={key} k={key} data={users[key]} />
      ))}
      <EditUser user={selectedUser} data={users} listings={listings} selectedUser={selectedUser} selectUser={selectUser} />
    </main>
  )
}