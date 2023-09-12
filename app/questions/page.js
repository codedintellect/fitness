export default function Questions() {
  const data = [
    {
      q: 'Нужна ли сменная обувь?',
      a: 'Рекомендую взять с собой сменную обувь (кроссовки/чешки) в связи с тем, что зал может находиться на другом этаже с раздевалкой, а в уличной обуви ходить по студии запрещено.'
    },
    {
      q: 'Почему меняется номер зала?',
      a: 'Выбранный зал для тренировки зависит от количества человек, записанных на занятие и подбирается по необходимой площади.'
    }
  ];

  return (
    <main className='flex flex-col justify-items-center basis-full text-left mx-4 mb-10 sm:mx-auto sm:max-w-2xl'>
      {data.map((x) => (
        <Question q={x['q']} a={x['a']} />
      ))}
    </main>
  )
}

function Question({q, a}) {
  return (
    <div className='flex flex-col m-2 text-xl rounded-xl overflow-hidden border-2 border-selection'>
      <span className='bg-selection text-white font-bold p-2'>
        <i class="bi bi-question-lg mr-1"></i>
        {q}
      </span>
      <span className='p-2'>
        <i class="bi bi-card-text mr-1"></i>
        {a}
      </span>
    </div>
  )
}