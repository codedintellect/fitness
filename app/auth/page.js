'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { app } from '../firebase'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';

const db = getDatabase(app);

export default function Auth() {
  const [isLogin, setType] = useState(false);

  const router = useRouter();

  return (
    <main className='w-full h-full flex flex-col justify-center px-4'>
      <div className='flex flex-wrap gap-2 border-2 border-selection w-full max-w-sm p-2 mx-auto rounded-3xl'>
        <div className='relative basis-full flex bg-gray-300 rounded-t-2xl rounded-b-lg border-2 border-black overflow-hidden'>
          <div className={`absolute w-1/2 h-full bg-white transition-all ${isLogin ? 'left-1/2' : 'left-0'}`}></div>
          <input className='relative basis-1/2 text-xl text-center font-bold p-1' type='button' value='РЕГИСТРАЦИЯ' onClick={()=>setType(false)} />
          <input className='relative basis-1/2 text-xl text-center font-bold p-1' type='button' value='ВХОД' onClick={()=>setType(true)} />
        </div>
        <Field hint='имя' id='firstname' c={`basis-1/3 grow transition-all ${isLogin ? 'max-h-0 border-0' : 'max-h-14 border-2'}`} regex='[a-zA-Zа-яА-Я\s.\-]*' />
        <Field hint='фамилия' id='lastname' c={`basis-1/3 grow transition-all ${isLogin ? 'max-h-0 border-0' : 'max-h-14 border-2'}`} regex='[a-zA-Zа-яА-Я\s.\-]*' />
        <Field hint='логин' id='username' c='basis-full border-2' regex='[a-zA-Z0-9._\-]*' />
        <Field hint='пароль' id='password' type='password' c='basis-full border-2' />
        <button className='bg-white border-2 border-black px-2 py-1 mx-auto rounded-t-lg rounded-b-2xl' onClick={()=>submit(isLogin, router)}>
          продолжить
        </button>
      </div>
    </main>
  )
}

function Field({hint, type, id, c, regex}) {
  return (
    <div className={`relative flex flex-col bg-white px-2 border-black rounded-2xl overflow-hidden ${c}`}>
      <snap className='font-bold'>
        {hint}
      </snap>
      <snap className={`absolute ${type=='password' ? '' : 'hidden'} right-0 mx-2 text-gray-600`}>
        минимум 6 символов
      </snap>
      <input className='rounded-2xl text-lg text-center' type={type} minLength={type=='password' ? 6 : 0} id={id} pattern={regex} onChange={(e)=>monitorValidity(e)} />
    </div>
  )
}

function monitorValidity(event) {
  const element = event.target;
  const parent = element.parentElement;
  parent.style.borderColor = element.checkValidity() ? '' : 'rgb(255, 0, 0)';
}

function submit(isLogin, router) {
  let firstname = document.getElementById('firstname');
  let lastname = document.getElementById('lastname');
  let username = document.getElementById('username');
  let password = document.getElementById('password');

  let valid = true;

  if (!isLogin) {
    if (firstname.value == '') {
      valid = false;
      firstname.parentElement.style.borderColor = 'rgb(255, 0, 0)'
    }
    if (lastname.value == '') {
      valid = false;
      lastname.parentElement.style.borderColor = 'rgb(255, 0, 0)'
    }
  }
  if (username.value == '') {
    valid = false;
    username.parentElement.style.borderColor = 'rgb(255, 0, 0)'
  }
  if (password.value.length < 6) {
    valid = false;
    password.parentElement.style.borderColor = 'rgb(255, 0, 0)'
  }

  if (!valid) return;

  if (!isLogin) {
    if (!firstname.checkValidity()) {
      console.error("invalid firstname");
      return null;
    }
    if (!lastname.checkValidity()) {
      console.error("invalid lastname");
      return null;
    }
  }
  if (!username.checkValidity()) {
    console.error("invalid username");
    return null;
  }

  if (isLogin) {
    console.log('using existing account');
    signInWithEmailAndPassword(getAuth(app), `${username.value}@sanchos-fit.web.app`, password.value)
      .then((userCredential) => {
        router.push('/profile/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
          alert('Неверный пароль!\nЕсли вы забыли свой пароль свяжитесь с администратором.');
        }
        else if (errorCode == 'auth/user-not-found') {
          alert('Этого пользователя нет в нашей системе.');
        }
        else {
          console.error(error);
          alert(error);
        }
      });
  }
  else {
    createUserWithEmailAndPassword(getAuth(app), `${username.value}@sanchos-fit.web.app`, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        set(ref(db, `users/${user.uid}`), {
          name: `${firstname.value} ${lastname.value}`
        }).then(() => {
          router.push('/profile/');
        }).catch((error) => {
          console.error(error);
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/email-already-in-use') {
          alert('Данный логин уже занят существующим пользователем');
        }
        else {
          console.error(error);
          alert(error);
        }
      });
  }
}