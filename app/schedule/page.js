'use client'

import { useState, useEffect, useContext } from 'react'

import { database } from '../firebase'
import { ref, onValue, get, push, update, remove, query, orderByChild } from "firebase/database";

import { UserContext } from '../layout';
import getActivePass from '../components/activepass';

var user = null;
var sessions = null;

export default function Schedule() {
  user = useContext(UserContext);
  const [s, setSessions] = useState([]);
  sessions = s;

  useEffect(() => {
    const dataRef = ref(database, 'sessions');

    return onValue(dataRef, (snapshot) => {
      setSessions(snapshot.val());
    });
  }, []);

  const months = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
  const [selectedMonth, setMonth] = useState(new Date().getMonth());

  function clampMonth(delta) {
    const availableMonths = 3;
    let whitelist = [];
    for (var i = 0; i < availableMonths; i++) {
      whitelist.push((new Date().getMonth() + i) % 12);
    }
    return !(whitelist.includes(selectedMonth + delta));
  }

  function changeMonth(delta) {
    if (clampMonth(delta)) {
      return null;
    }
    setMonth((selectedMonth + delta + 12) % 12);
    return null;
  }

  function generateCalendar(month) {
    let today = new Date();
    let year = today.getFullYear() + (month < today.getMonth() ? 1 : 0);
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let result = [];

    for (var i = 0; i < daysInMonth; i++) {
      let day = new Date(Date.UTC(year, month, i+1));
      let scheduleForDay = {}
      for (var id in sessions) {
        const t = sessions[id];
        if (day.getTime() + (t["start"] % 86400000) != t["start"]) continue;
        scheduleForDay[id] = t;
      }
      result.push(<Day key={`t${day.getTime()}`} day={new Date(year, month, i + 1)} sessions={scheduleForDay}/>);
    }

    return (result)
  }

  return (
    <main className='relative flex flex-col text-left mx-auto max-w-2xl h-full'>
      <h1 className='text-xl text-center sm:text-4xl mt-4 sm:mt-6'>
        Тренировки с Анжелой Андерсон
      </h1>
      <div className='mx-auto bg-selection text-3xl text-white font-medium py-1 my-4'>
        <p>
          <button className='px-2' style={{color: `${clampMonth(-1) ? 'rgb(var(--fallback-rgb))' : 'rgb(255, 255, 255)'}`}} onClick={() => changeMonth(-1)}>
            &lt;
          </button>
          ЗАПИСЬ НА {months[selectedMonth]}
          <button className='px-2' style={{color: `${clampMonth(1) ? 'rgb(var(--fallback-rgb))' : 'rgb(255, 255, 255)'}`}} onClick={() => changeMonth(1)}>
            &gt;
          </button>
        </p>
      </div>
      <div className='overflow-scroll grow'>
        {generateCalendar(selectedMonth)}
      </div>
    </main>
  )
}

function Day({day, sessions}) {
  const dayOfWeek = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
  const empty = Object.entries(sessions).length > 0;

  let bgColor = 'bg-white';
  if (empty) {
    bgColor = 'bg-selection';
  }
  if (new Date() - day > 1000*60*60*24) {
    bgColor = 'bg-gray-200';
  }

  return (
    <div className={`${bgColor} relative p-1 m-2 border-2 border-black rounded-lg`}>
      <div className='w-full'>
        <span className='pr-4 font-bold'>
          {day.toLocaleString('ru-ru', {day: '2-digit', month: '2-digit'})}
        </span>
        <span className='font-bold'>
          {dayOfWeek[day.getDay()]}
        </span>
      </div>
      <div className={empty ? 'hidden' : ''}>
        <span className='text-2xl text-fallback'>
          НЕТ ЗАНЯТИЙ
        </span>
      </div>
      <div className='flex flex-col text-white text-xl divide-y divide-white'>
        {Object.keys(sessions).map((key) => (
          <Session key={key} sessionId={key} />
        ))}
      </div>
    </div>
  )
}

function Session({sessionId}) {
  const session = sessions[sessionId];
  const startTime = new Date(session["start"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  const endTime = new Date(session["end"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  const attending = sessions[sessionId]["attendees"] ? sessions[sessionId]["attendees"].hasOwnProperty(user.uid) : false;
  return (
    <div className='flex gap-2'>
      <div className='flex flex-wrap sm:flex-nowrap gap-x-3 basis-full pt-1 whitespace-nowrap'>
        <span>
          {startTime} - {endTime}
        </span>
        <span className='font-bold basis-full max-sm:order-first'>
          {session["title"]}
        </span>
        <span>
          {session["attendees"] ? Object.values(session["attendees"]).length : 0} / {session["slots"]}
        </span>
      </div>
      <input className={`${attending && 'hidden'} bg-white text-black font-bold px-2 my-auto rounded-lg`} type='button' value='ЗАПИСАТЬСЯ' onClick={()=>(Attend(sessionId))}/>
      <input className={`${!attending && 'hidden'} bg-red-400 text-black font-bold px-2 my-auto rounded-lg`} type='button' value='ОТМЕНИТЬ' onClick={()=>(Cancel(sessionId))}/>
    </div>
  )
}

async function Attend(sessionId) {
  const activePass = await getActivePass(user.uid);
  if (!activePass) return;

  const visitId = push(ref(database, `sessions/${sessionId}/attendees/`)).key;

  const updates = {};
  updates[`users/${user.uid}/passes/${activePass}/sessions/${visitId}`] = sessionId;
  updates[`sessions/${sessionId}/attendees/${user.uid}`] = visitId;

  return update(ref(database), updates);
}

async function Cancel(sessionId) {
  let passes = null;
  try {
    const snapshot = await get(ref(database, `users/${user.uid}/passes`));
    if (!snapshot.exists()) {
      console.warn("No passes found");
      return;
    }
    passes = snapshot.val();
  }
  catch(error){
    console.error(error);
    return;
  }
  const visitId = sessions[sessionId]["attendees"][user.uid];

  const usedPasses = Object.keys(passes)
    .filter((key) => (passes[key]["sessions"]))

  const activePass = usedPasses
    .find((key) => (Object.keys(passes[key]["sessions"]).includes(visitId)));

  const updates = {};
  updates[`users/${user.uid}/passes/${activePass}/sessions/${visitId}`] = null;
  updates[`sessions/${sessionId}/attendees/${user.uid}`] = null;

  return update(ref(database), updates);
}