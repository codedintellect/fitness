'use client'

import { useState, useEffect } from 'react'

import { database } from '../firebase'
import { ref, onValue } from "firebase/database";

export default function Schedule() {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, 'schedule');

    return onValue(dataRef, (snapshot) => {
      setTimeslots(snapshot.val());
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

  function generateCalendar(month, timeslots) {
    let today = new Date();
    let year = today.getFullYear() + (month < today.getMonth() ? 1 : 0);
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let result = [];

    for (var i = 0; i < daysInMonth; i++) {
      let day = new Date(Date.UTC(year, month, i+1));
      let sessions = {}
      for (var id in timeslots) {
        const t = timeslots[id];
        if (day.getTime() + (t["start"] % 86400000) < t["start"]) continue;
        if (day.getTime() + (t["end"] % 86400000) > t["end"]) continue;
        if (day.getUTCDay() != new Date(t["start"]).getUTCDay()) continue;
        sessions[id] = t;
      }
      result.push(<Day day={new Date(year, month, i + 1)} sessions={sessions}/>);
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
        {generateCalendar(selectedMonth, timeslots)}
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
          <Session key={key} session={sessions[key]} />
        ))}
      </div>
    </div>
  )
}

function Session({session}) {
  const startTime = new Date(session["start"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  const endTime = new Date(session["end"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  return (
    <div className='flex gap-2'>
      <div className='flex flex-wrap sm:flex-nowrap gap-x-3 basis-full pt-1 whitespace-nowrap'>
        <span className='order-2 sm:order-1'>
          {startTime} - {endTime}
        </span>
        <span className='font-bold basis-full order-1'>
          {session["title"]}
        </span>
        <span className='order-3'>
          0 / {session["slots"]}
        </span>
      </div>
      <input className='bg-white text-black font-bold px-2 my-auto rounded-lg' type='button' value='ЗАПИСАТЬСЯ' />
      <input className='hidden bg-red-400 text-black font-bold px-2 my-auto rounded-lg' type='button' value='ОТМЕНИТЬ' />
    </div>
  )
}