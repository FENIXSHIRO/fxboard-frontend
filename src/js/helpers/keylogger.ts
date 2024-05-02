const arrKeyDownCb: ((event: KeyboardEvent) => boolean)[] = []

// делаем глобальный обработчик нажатий клавиш
// для того чтобы обрабатывать нажатия не в порядке
// добавления, а чтобы обрабатывалось первым тот
// кто добавился последним
// калбек должен возвращать true если дальше
// клавишу обрабатывать не надо

window.addEventListener('keydown', (event) => {
  for (const cb of arrKeyDownCb) {
    if (cb(event)) break
  }
})

export function addKeyDownListener(cb: (event: KeyboardEvent) => boolean) {
  arrKeyDownCb.unshift(cb)
}

export function removeKeyDownListener(cb: (event: KeyboardEvent) => boolean) {
  const index = arrKeyDownCb.indexOf(cb)
  if (index !== -1) arrKeyDownCb.splice(index, 1)
}
