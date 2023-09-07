'use client'

import { useEffect, useState } from 'react'

import { database } from '../firebase'
import { ref, onValue } from "firebase/database";

export default function Prices() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, 'purchase');

    return onValue(dataRef, (snapshot) => {
      setListings(snapshot.val());
      console.log(listings);
    });
  }, []);


  return (
    <main className='flex flex-col text-left px-2 sm:mx-auto sm:max-w-2xl'>
      <h1 className='text-xl text-center sm:text-4xl my-4 sm:mt-6'>
        Цены
      </h1>
      {listings.map((i, k) => {
        return (<Item key={`listing${k}`} title={i.title} price={i.price} subline={i.subline} message={i.message} />);
      })}
    </main>
  )
}

function Item({title, price, subline, message}) {
  return (
    <div className='flex flex-row items-center bg-white p-2 m-1 rounded-2xl'>
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
    const phoneRef = ref(database, 'contact');

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