'use client'

import { app } from '../firebase'
import { getDatabase, ref, onValue, query, orderByChild } from "firebase/database";

import { useState, useEffect } from 'react'
import EditSession from './admin';

const db = getDatabase(app);

export default function Users() {
  const [sessions, setSessions] = useState({});
  const [selectedSession, selectSession] = useState('');

  useEffect(() => {
    const sessionsRef = ref(db, `sessions`);

    return onValue(sessionsRef, (snapshot) => {
      setSessions(snapshot.val());
    });
  }, []);

  function Session({k, data}) {
    return (
      <div className='flex'>
        <span className='text-xl basis-full'>
          {new Date(data['start']).toISOString().substring(0,16)}-{new Date(data['end']).toISOString().substring(11,16)} {data['title']}
        </span>
        <span className='text-xl whitespace-nowrap'>
          {data.hasOwnProperty('attendees') ? Object.keys(data['attendees']).length : '0'} / {data['slots']}
        </span>
        <button className='bg-white p-1 rounded-md' onClick={()=>(selectSession(k))}>
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
      {Object.keys(sessions).sort((a, b) => sessions[a]['start'] - sessions[b]['start']).map((key) => (
        <Session key={key} k={key} data={sessions[key]} />
      ))}
      <EditSession data={sessions} selectedSession={selectedSession} selectSession={selectSession} />
    </main>
  )
}