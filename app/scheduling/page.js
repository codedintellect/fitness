'use client'

import { app } from '../firebase'
import { getDatabase, get, ref, onValue, query, orderByChild } from "firebase/database";

import { useState, useEffect } from 'react'
import EditSession from './admin';

const db = getDatabase(app);

export default function Users() {
  const [sessions, setSessions] = useState({});
  const [selectedSession, selectSession] = useState('');
  const [users, setUsers] = useState({});

  useEffect(() => {
    const sessionsRef = ref(db, `sessions`);

    return onValue(sessionsRef, async (snapshot) => {
      try {
        const snapshot = await get(ref(db, 'users'));
        if (!snapshot.exists()) {
          console.warn("No users found");
        }
        setUsers(snapshot.val());
      }
      catch(error) {
        console.error(error);
      }
      setSessions(snapshot.val());
    });
  }, []);

  function Session({k, data}) {
    const time = (x) => (new Date(x).toLocaleTimeString('ru-ru', {hour:'2-digit', minute:'2-digit', timeZone:'UTC'}))

    return (
      <div className='relative flex flex-wrap items-center pt-1'>
        <span className='text-xl grow' title={k}>
          {time(data['start'])}-{time(data['end'])} {data['title']}
        </span>
        <div hidden={!data['canceled']} className='absolute my-auto backdrop-blur-[1px] w-full -translate-x-1/2 left-1/2'>
          <div className='relative w-full text-xl text-center text-red-400 font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
            ОТМЕНА
          </div>
        </div>
        <span className='text-xl whitespace-nowrap'>
          {data.hasOwnProperty('attendees') ? Object.keys(data['attendees']).length : '0'} / {data['slots']}
        </span>
        <button className='bg-white px-2 pt-1 rounded-md hidden' onClick={()=>(selectSession(k))}>
          <span className='bi bi-pencil-fill' />
        </button>
        <span className='basis-full flex flex-wrap gap-x-1'>
          {data.hasOwnProperty('attendees') && Object.keys(data['attendees']).map((x, i, arr) => (
            <span className='whitespace-nowrap'>
              {(users.hasOwnProperty(x) && users[x].hasOwnProperty('name') ? users[x]['name'] : 'UNKNOWN').trim()}
              {i + 1 < arr.length ? ',' : ''}
            </span>
          ))}
        </span>
      </div>
    )
  }

  function generateInfo() {
    const data = {};
    const sortedSessions = Object.keys(sessions)
      .sort((a,b) => (sessions[a]['start'] - sessions[b]['start']));

    for (const key of sortedSessions) {
      const day = new Date(sessions[key]['start']).toISOString().substring(0,10);
      if (!data.hasOwnProperty(day)) data[day] = {};
      Object.assign(data[day], {[key]: sessions[key]});
    }

    return Object.keys(data).map((date) => (
      <div key={date} className='flex flex-col mt-2'>
        <span className='relative bg-primary px-2 mx-auto translate-y-2 text-2xl font-bold z-1'>
          {new Date(date).toLocaleDateString('ru-ru', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'})}
        </span>
        <div className='divide-y-2 divide-selection outline outline-selection outline-offset-8 rounded-xl'>
          {Object.keys(data[date]).map((x) => (
            <Session key={x} k={x} data={sessions[x]} />
          ))}
        </div>
      </div>
    ));
  }
  
  return (
    <main className='relative flex flex-col text-left mx-4 mb-10 sm:mx-auto sm:max-w-2xl h-full'>
      <span className='text-4xl text-center mt-4 sm:mt-6'>
        ТРЕНИРОВКИ
      </span>
      {generateInfo()}
      <EditSession data={sessions} selectedSession={selectedSession} selectSession={selectSession} />
    </main>
  )
}