'use client'

import { getDatabase, ref, push, update } from 'firebase/database';
import { app } from '../firebase';

const db = getDatabase(app);

export default function EditUser({user, data, listings, selectedUser, selectUser}) {
  if (user === '') return;
  return (
    <div className='absolute flex flex-wrap gap-2 w-full p-6 md:mb-2 bottom-0 rounded-t-3xl md:rounded-b-3xl bg-red-400'>
      <span className='text-3xl text-center basis-full'>
        {data[user]['name']}
      </span>
      <button className='absolute' onClick={()=>(selectUser(''))}>
        <span className='text-3xl bi bi-x'></span>
      </button>
      <div className='flex flex-wrap w-full bg-white rounded-xl p-2'>
        <select className='basis-full' name='type' id='passtype'>
          {listings.map((x, i) => (
            <option value={i}>{x['title']}</option>
          ))}
        </select>
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            ДАТА ПОКУПКИ
          </span>
          <input type='date' id='purchaseDate' />
        </div>
        <div className='flex flex-col m-1'>
          <span className='text-center'>
            ДАТА ИСТЕЧЕНИЯ
          </span>
          <input type='date' id='expirationDate' />
        </div>
        <button className='basis-full' onClick={()=>(AddPurchase(selectedUser, listings))}>
          ДОБАВИТЬ
        </button>
      </div>
    </div>
  )
}

function AddPurchase(userId, listings) {
  const listingId = document.getElementById('passtype').value;
  const listing = listings[listingId];
  const purchaseDate = document.getElementById('purchaseDate').value;
  const expirationDate = document.getElementById('expirationDate').value;

  const payload = {
    title: listing['title'],
    private: listing['private'],
    amount: listing['uses'],
    purchasedOn: new Date(purchaseDate).getTime(),
    expiresOn: new Date(expirationDate).getTime()
  };

  const newKey = push(ref(db, `passes/${userId}`)).key;

  const updates = {};
  updates[`passes/${userId}/${newKey}`] = payload;

  return update(ref(db), updates);
}