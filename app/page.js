import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex flex-col justify-items-center basis-full text-left sm:mx-auto sm:max-w-2xl'>
      <Image
        src=''
        width={500}
        height={300}
        alt='Picture of the author'
      />
      <p className='text-4xl font-semibold text-center'>
        Анжела Александра Андерсон
      </p>
      <p className='text-2xl text-center'>
        ФИТНЕС-ТРЕНЕР
      </p>
      <p className='text-2xl my-4'>
        Личная спортивная практика − более 14 лет.
        <br></br>
        Тренерский опыт работы − более 4 лет.
      </p>
      <p className='text-2xl font-semibold'>
        Образование:
      </p>
    </main>
  )
}
