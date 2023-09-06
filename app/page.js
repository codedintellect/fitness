import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex flex-col justify-items-center basis-full text-left mx-4 mb-10 sm:mx-auto sm:max-w-2xl'>
      <div className='border-2 border-black rounded-3xl text-center my-4 overflow-hidden'>
        <Image
          src='/first.jpeg'
          width={1600}
          height={1066}
          alt='Picture of the author'
        />
      </div>
      <p className='text-3xl sm:text-4xl font-semibold text-center'>
        Анжела Александра Андерсон
      </p>
      <p className='text-xl sm:text-2xl text-center'>
        ФИТНЕС-ТРЕНЕР
      </p>
      <p className='text-xl sm:text-2xl my-2'>
        Быть тренером для меня работа мечты! Ведь я помогаю людям реализовывать
        свои желания и цели, что доставляет мне неимоверное удовольствие на
        протяжении всего пути: от процесса до результата. 
      </p>
      <p className='text-xl sm:text-2xl my-2'>
        Личная спортивная практика − более 14 лет.
        <br></br>
        Тренерский опыт работы − более 4 лет.
      </p>
      <p className='text-xl sm:text-2xl font-semibold mt-2'>
        Образование:
      </p>
      <p className='text-xl sm:text-2xl my-2'>
        - Кандидат в мастера спорта по прыжкам с шестом
        <br></br>
        - Многократный победитель и призёр Московских и Всероссийских соревнований по прыжкам с шестом
        <br></br>
        - Сертифицированный тренер по растяжке Topeurofit и растяжке в гамаках Airstretching
        <br></br>
        - Академия FPA по специализации «Фитнес-нутрициолог»
        <br></br>
        - Студент Первого Московского государственного медицинского университета им И. М. Сеченова по специальности «лечебное дело» 
      </p>
      <p className='text-xl sm:text-2xl my-2'>
        В своих тренировках я использую знания анатомии и физиологии, что
        позволяет мне грамотно подбирать упражнения для каждого своего ученика.
        Уделяю внимание абсолютно каждому, скучно со мной точно не будет!
      </p>
    </main>
  )
}
