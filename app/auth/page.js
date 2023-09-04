export default function Auth() {
  return (
    <main className='flex flex-col justify-items-center text-left sm:mx-auto sm:max-w-2xl'>
      <form className='flex flex-col gap-2 mx-6 sm:mx-auto my-6 sm:w-96'>
        <input className='w-full p-2 border-2 border-black rounded-lg' type='tel'>
        
        </input>
        <input className='w-full p-2 border-2 border-black rounded-lg' type='password'>
        
        </input>
        <button className='w-fit px-4 py-1 mx-auto bg-white border-2 border-black rounded-lg'>
          ВОЙТИ
        </button>
      </form>
    </main>
  )
}
