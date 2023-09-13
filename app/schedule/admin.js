export default function CreateTimeslot() {
  return (
    <div className='absolute flex flex-wrap gap-2 w-full p-6 md:mb-2 bottom-0 rounded-t-3xl md:rounded-b-3xl bg-red-400'>
      <input className='w-full p-1 text-lg font-bold' type='text' placeholder='TITLE' />
      <div className='flex flex-wrap gap-1 basis-3/8 grow bg-fallback p-1'>
        <span className='w-full text-center'>
          START
        </span>
        <input className='grow text-center' type='date' />
        <input className='grow text-center' type='time' />
      </div>
      <div className='flex flex-row-reverse flex-wrap gap-1 basis-3/8 grow bg-fallback p-1'>
        <span className='w-full text-center'>
          END
        </span>
        <input className='grow text-center' type='date' />
        <input className='grow text-center' type='time' />
      </div>
      <input className='w-full p-1 text-lg font-bold bg-white' type='button' value='CREATE' />
      <input className='w-full p-1 text-lg text-white font-bold border-2 border-white' type='button' value='CANCEL' />
    </div>
  )
}