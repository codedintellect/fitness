'use client'

import { useState } from 'react'

export default function Schedule() {
  const months = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];
  const [selectedMonth, setMonth] = useState(new Date().getMonth());

  function changeMonth(delta) {
    if (selectedMonth == new Date().getMonth() && delta == -1) {
      return null;
    }
    if (selectedMonth == new Date().getMonth() + 2 && delta == 1) {
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
    <main className="flex flex-col justify-items-center basis-full text-left mx-auto max-w-2xl mt-6">
      <h1 className="text-2xl text-center sm:text-4xl">
        Тренировки с Анжелой Андерсон
      </h1>
      <div className="mx-auto text-3xl text-white font-medium py-1 my-4" style={{backgroundColor: 'rgb(var(--selection-rgb))'}}>
        <p>
          <button className="px-2" onClick={() => changeMonth(-1)}>
            &lt;
          </button>
          ЗАПИСЬ НА {months[selectedMonth]}
          <button className="px-2" onClick={() => changeMonth(1)}>
            &gt;
          </button>
        </p>
      </div>
      <div className=''>
        {generateCalendar(selectedMonth)}
      </div>
    </main>
  )
}

function Day({day, sessions}) {
  const dayOfWeek = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"];

  let bgColor = "bg-white";
  if (sessions) {
    bgColor = "bg-selection";
  }
  if (new Date() - day > 1000*60*60*24) {
    bgColor = "bg-gray-200";
  }

  return (
    <div className={bgColor + " relative p-1 m-2 border-2 border-black rounded-lg"}>
      <div className="w-full">
        <span className="pr-4 font-bold">
          {day.toLocaleString("ru-ru", {day: "2-digit", month: "2-digit"})}
        </span>
        <span className="font-bold">
          {dayOfWeek[day.getDay()]}
        </span>
      </div>
      <div className={sessions ? "hidden" : ""}>
        <span className="text-2xl text-fallback">
          НЕТ ЗАНЯТИЙ
        </span>
      </div>
      <div className={sessions ? "" : "hidden"}>
      </div>
    </div>
  )
}