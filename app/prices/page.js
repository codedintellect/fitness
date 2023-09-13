'use client'

import { useEffect, useState } from 'react'

import { app } from '../firebase'
import { getDatabase, ref, onValue } from "firebase/database";

const db = getDatabase(app);

export default function Prices() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const dataRef = ref(db, 'purchase');

    return onValue(dataRef, (snapshot) => {
      setListings(snapshot.val());
    });
  }, []);


  return (
    <main className='flex flex-col gap-y-2 text-left px-2 h-full overflow-hidden sm:mx-auto sm:max-w-2xl'>
      <span className='text-4xl text-center my-4 sm:mt-6'>
        ЦЕНЫ
      </span>
      {listings.map((i, k) => {
        return (<Item key={`listing${k}`} title={i.title} price={i.price} subline={i.subline} message={i.message} />);
      })}
      <div className='overflow-hidden rounded-t-xl mx-20 mt-auto'>
        <img src='/heart.jpg' />
      </div>
    </main>
  )
}

function Item({title, price, subline, message}) {
  return (
    <div className='flex flex-row items-center bg-white p-2 rounded-2xl'>
      <div className='grow'>
        {title} - {price}₽
        {subline != "" && <br></br>}
        <span className='text-fallback'>
          {subline}
        </span>
      </div>
      <ContactButton text={message} />
    </div>
  )
}

function ContactButton({text}) {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const phoneRef = ref(db, 'contact');

    return onValue(phoneRef, (snapshot) => {
      setPhone(snapshot.val());
      console.log(phone);
    });
  }, []);

  return (
    <a href={`https://wa.me/${phone}/?text=${encodeURI(text)}`}>
      <div className='w-fit px-2 py-1 bg-primary border-2 border-black text-center rounded-lg whitespace-nowrap'>
        <i className='bi bi-whatsapp mr-1'></i>
        <span>
          Приобрести
        </span>
      </div>
    </a>
  )
}