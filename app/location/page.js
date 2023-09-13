export default function Location() {
  return (
    <main className='flex flex-col gap-2 mx-4 justify-center h-full sm:mx-auto sm:max-w-2xl'>
      <span className='absolute top-0 text-4xl -translate-x-1/2 left-1/2 text-center my-4 sm:mt-6'>
        АДРЕС ЗАЛА
      </span>
      <a href='http://maps.apple.com/?q=55.729748,37.6473319' target='_blank' className='bg-white text-xl p-2 mx-auto border-2 border-black rounded-lg'>
        <i class='bi bi-geo-alt-fill mr-1 text-red-400'></i>
        Открыть в «Картах»
      </a>
      <span className='text-center'>
        <i class='bi bi-geo text-red-400 mr-1'></i>
        м. Павелецкая (от метро 5 минут пешком)
        <br></br>
        Шлюзовая набережная 8с2 (школа танцев Dance First)
      </span>
      <div className='fixed w-4/5 max-w-xl flex gap-2 bottom-0 -translate-x-1/2 left-1/2 mb-3 items-center bg-red-400 p-3 rounded-2xl text-2xl text-white'>
        <i class='bi bi-exclamation-diamond text-5xl'></i>
        <div className='flex flex-col'>
          <span className='grow font-black'>
            Будьте внимательны!
          </span>
          <span className='max-sm:text-xl'>
            Номер зала проведения тренировки может меняться.
          </span>
        </div>
      </div>
    </main>
  )
}
