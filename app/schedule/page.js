'use client'

import { useState } from 'react'

export default function Schedule() {
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
      result.push(<Day day={new Date(year, month, i + 1)} sessions={null}/>);
    }

    return (result)
  }

  return (
    <main className='flex flex-col justify-items-center basis-full text-left mx-auto max-w-2xl h-screen'>
      <h1 className='text-2xl text-center sm:text-4xl mt-6'>
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

  let bgColor = 'bg-white';
  if (sessions) {
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
      <div className={sessions ? 'hidden' : ''}>
        <span className='text-2xl text-fallback'>
          НЕТ ЗАНЯТИЙ
        </span>
      </div>
      <div className={sessions ? '' : 'hidden'}>
      </div>
    </div>
  )
}