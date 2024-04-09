'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation';

import { app } from '../firebase'
import { getDatabase, ref, onValue, get, push, update, remove, query, orderByChild } from "firebase/database";

import { UserContext } from '../layout';
import getActivePass from '../components/activepass';

const db = getDatabase(app);
var router = null;

var user = null;
var sessions = null;

export default function Schedule() {
  user = useContext(UserContext);
  const [s, setSessions] = useState([]);
  sessions = s;

  router = useRouter();

  useEffect(() => {
    scrollToToday();
    const dataRef = ref(db, 'sessions');
    const q = query(dataRef, orderByChild('start'));

    return onValue(q, (snapshot) => {
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
    return !(whitelist.includes((selectedMonth + delta + 12) % 12));
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

  function scrollToToday() {
    let calendar = document.getElementById('calendar');

    if (!calendar) return;

    if (selectedMonth == new Date().getUTCMonth()) {
      const dayId = new Date().getDate();
      const today = document.querySelector(`#calendar :nth-child(${dayId})`);
      calendar.scrollTo(0, today.offsetTop);
    }
    else {
      calendar.scrollTo(0, 0);
      return;
    }
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
      <div id='calendar' className='relative snap-y overflow-scroll grow'>
        {generateCalendar(selectedMonth)}
      </div>
    </main>
  )
}

function Day({day, sessions}) {
  const dayOfWeek = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'];
  const empty = Object.entries(sessions).length > 0;
  const past = new Date() - day > 1000*60*60*24;

  let bgColor = 'bg-white';
  if (empty) {
    bgColor = 'bg-selection';
  }
  if (past) {
    bgColor = 'bg-gray-200';
  }

  return (
    <div className={`${bgColor} relative snap-start p-1 m-2 border-2 border-black rounded-lg`}>
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
      <div className={`flex flex-col ${past ? 'text-black divide-black' : 'text-white divide-white'} text-xl divide-y`}>
        {Object.keys(sessions).map((key) => (
          <Session key={key} sessionId={key} />
        ))}
      </div>
    </div>
  )
}

function optionButton(sessionId, cancelled, past, cancelDeadline, attending, full) {
  if (cancelled || past) return;
  // if (attending && past) return;
  let colors = "bg-white text-black";
  if (full) colors = "bg-fallback text-gray-600";
  if (attending) colors = "bg-red-300 text-black";
  if (attending && cancelDeadline) colors = "bg-fallback text-gray-600";
  return (
    <input
      className={`${colors} font-bold px-2 my-auto rounded-lg`}
      disabled={(!attending && full) || (attending && cancelDeadline)}
      type='button'
      value={attending ? cancelDeadline ? 'ЗАПИСАН' : 'ОТМЕНИТЬ' : full ? 'НЕТ МЕСТ' : 'ЗАПИСАТЬСЯ'}
      onClick={()=>(attending ? Cancel(sessionId) : full ? null : Attend(sessionId))}/>)
}

function Session({sessionId}) {
  const session = sessions[sessionId];
  const startTime = new Date(session["start"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  const endTime = new Date(session["end"]).toLocaleString('ru-ru', {hour: '2-digit', minute: '2-digit', timeZone: 'UTC'});
  const attending = user ? sessions[sessionId]["attendees"] ? sessions[sessionId]["attendees"].hasOwnProperty(user.uid) : false : false;
  const full = session["attendees"] ? Object.values(session["attendees"]).length == session['slots'] : false;
  const past = new Date() - sessions[sessionId]['start'] > 0;
  const cancelDeadline = new Date() - sessions[sessionId]['start'] > -24 * 60 * 60 * 1000;
  const cancelled = sessions[sessionId]['canceled'];
  return (
    <div className='flex gap-2'>
      <div className='relative flex flex-wrap sm:flex-nowrap gap-x-3 basis-full pt-1 whitespace-nowrap'>
        <span>
          {startTime} - {endTime}
        </span>
        <span className={`font-bold basis-full max-sm:order-first ${cancelled && 'line-through'}`}>
          {session["title"]}
        </span>
        <span>
          {`${session["attendees"] ? Object.values(session["attendees"]).length : 0} / ${session["slots"]}`}
        </span>
      </div>
      {optionButton(sessionId, cancelled, past, cancelDeadline, attending, full)}
      <span hidden={!cancelled} className='text-red-400 font-bold pt-1 my-auto drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
        ОТМЕНА
      </span>
    </div>
  )
}

async function Attend(sessionId) {
  if (!user) {
    router.push('/auth/');
    return;
  }
  const activePass = await getActivePass(user.uid);
  if (!activePass) {
    router.push('/prices/');
    return;
  }

  const visitId = push(ref(db, `sessions/${sessionId}/attendees/`)).key;

  const updates = {};
  updates[`passes/${user.uid}/${activePass}/sessions/${visitId}`] = sessionId;
  updates[`sessions/${sessionId}/attendees/${user.uid}`] = visitId;

  return update(ref(db), updates);
}

export async function Cancel(sessionId, u, s) {
  u = u || user;
  s = s || sessions;
  let passes = null;
  try {
    const snapshot = await get(ref(db, `passes/${u.uid}`));
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
  const visitId = s[sessionId]["attendees"][u.uid];

  const usedPasses = Object.keys(passes)
    .filter((key) => (passes[key]["sessions"]))

  const activePass = usedPasses
    .find((key) => (Object.keys(passes[key]["sessions"]).includes(visitId)));

  const updates = {};
  updates[`passes/${u.uid}/${activePass}/sessions/${visitId}`] = null;
  updates[`sessions/${sessionId}/attendees/${u.uid}`] = null;

  return update(ref(db), updates);
}