'use client'

import { getDatabase, ref, push, update } from 'firebase/database';
import { app } from '../firebase';

const db = getDatabase(app);

export default function EditSession({data, selectedSession, selectSession}) {
  if (!selectedSession) return;

  function ModifySession(sessionId) {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').valueAsDate;
    const startTime = document.getElementById('startTime').valueAsDate;
    const endTime = document.getElementById('endTime').valueAsDate;
    const slots = document.getElementById('slots').valueAsNumber;
  
    const updates = {};
    updates[`sessions/${sessionId}/end`] = date.getTime() + endTime.getTime();
    updates[`sessions/${sessionId}/slots`] = slots;
    updates[`sessions/${sessionId}/start`] = date.getTime() + startTime.getTime();
    updates[`sessions/${sessionId}/title`] = title;

    selectSession('');
  
    return update(ref(db), updates);
  }

  const n = data.hasOwnProperty(selectedSession);

  return (
    <div className='fixed flex flex-col gap-2 w-full p-4 md:mb-2 bottom-0 rounded-t-3xl md:rounded-b-3xl bg-red-400'>
      <span className='self-center text-3xl text-center bg-white px-1 pt-1 rounded-lg'>
        {selectedSession}
      </span>
      <button className='absolute' onClick={()=>(selectSession(''))}>
        <span className='text-3xl bi bi-x'></span>
      </button>
      <button className='absolute right-0 -translate-x-1/2' onClick={()=>(selectSession(push(ref(db, 'sessions')).key))}>
        <span className='text-3xl bi bi-plus'></span>
      </button>
      <div className='flex flex-wrap w-full bg-white rounded-xl p-2'>
        <input className='basis-full bg-gray-200' name='type' id='title' defaultValue={n ? data[selectedSession]['title'] : ''} />
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            ДАТА
          </span>
          <input type='date' id='date' defaultValue={n ? new Date(data[selectedSession]['start']).toISOString().substring(0,10) : ''} />
        </div>
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            НАЧАЛО
          </span>
          <input type='time' id='startTime' defaultValue={n ? new Date(data[selectedSession]['start']).toISOString().substring(11,16) : ''} />
        </div>
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            КОНЕЦ
          </span>
          <input type='time' id='endTime' defaultValue={n ? new Date(data[selectedSession]['end']).toISOString().substring(11,16) : ''} />
        </div>
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            МЕСТ
          </span>
          <input className='bg-gray-200' type='number' id='slots' defaultValue={n ? data[selectedSession]['slots'] : ''} />
        </div>
        <button className='basis-full' onClick={() => ModifySession(selectedSession)}>
          DONE
        </button>
      </div>
    </div>
  )
}
