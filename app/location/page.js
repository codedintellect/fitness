'use client'

export default function Location() {
  const images = [...Array(7).keys()];

  const scrollClick = (e) => {
    let t = e.target;
    let gallery = document.getElementById('gallery');
    if (t.id === 'scrollLeft') {
      gallery.scrollTo({
        top: 0,
        left: Math.max(0, gallery.scrollLeft - t.parentElement.parentElement.children.item(1).scrollWidth),
        behavior: 'smooth'
      });
    }
    else if (t.id === 'scrollRight') {
      gallery.scrollTo({
        top: 0,
        left: Math.min(gallery.scrollWidth, gallery.scrollLeft + t.parentElement.parentElement.children.item(1).scrollWidth),
        behavior: 'smooth'
      });
    }
  }

  return (
    <main className='absolute -translate-x-1/2 left-1/2 w-full max-w-2xl h-full flex flex-col justify-between'>
      <span className='w-full top-0 text-4xl text-center my-3'>
        АДРЕС ЗАЛА
      </span>
      <div className='relative aspect-[10/16]'>
        <div id='gallery' className="h-full overflow-y-scroll flex gap-x-2 px-[40%] no-scrollbar snap-x snap-mandatory">
          {images.map((imgId) => (
            <div key={imgId} style={{backgroundImage: `url("/location/guide${imgId}.jpeg")`}} className="h-full aspect-[9/16] bg-contain bg-no-repeat rounded-3xl snap-center snap-always"></div>
          ))}
          <div className="absolute inset-0 flex items-stretch text-4xl text-selection pointer-events-none">
            <div className="grow bg-gradient-to-r from-primary via-primary via-30% to-transparent">
              <i id='scrollLeft' className="relative bg-primary pt-2 rounded-full bi bi-caret-left -translate-y-1/2 top-1/2 pointer-events-auto" onClick={scrollClick}></i>
            </div>
            <div className="aspect-[9/16]"></div>
            <div className="grow bg-gradient-to-l from-primary via-primary via-30% to-transparent">
              <i id='scrollRight' className="relative bg-primary pt-2 rounded-full bi bi-caret-right -translate-y-1/2 top-1/2 pointer-events-auto float-right" onClick={scrollClick}></i>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-2'>
        <a href='http://maps.apple.com/?q=55.729748,37.6473319' target='_blank' className='bg-white text-xl p-2 mx-auto border-2 border-black rounded-lg'>
          <i className='bi bi-geo-alt-fill mr-1 text-red-400'></i>
          Открыть в «Картах»
        </a>
        <span className='text-center'>
          <i className='bi bi-geo text-red-400 mr-1'></i>
          м. Павелецкая (от метро 5 минут пешком)
          <br></br>
          Шлюзовая набережная 8с2 (школа танцев Dance First)
        </span>
      </div>
    </main>
  )
}
