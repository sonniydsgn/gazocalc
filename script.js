const form = document.querySelector('.form');
const formInner = document.querySelector('.form__inner');
const result = document.querySelector('.result')
const resultNumber = document.querySelector('.result-number')
const body = document.body
let data = {}

// функции
function calculate(data) {
  // собираю размеры стен в переменные
  const wallH = +data['wall-height'];
  const wallL = +data['wall-length'];
  const blockSize = data['block-size'];

  // удаляю размеры стен из данных, чтобы остались только проемы
  clearWallData()

  // складываю площади проемов в одну переменную
  const aperture = Math.abs(Object.values(data).reduce((a, b) => a + b, 0));

  // считаю общую площадь строения
  const area = Math.ceil(wallL * wallH - aperture) * 1.05;

  // считаю количество блоков
  const blocksValue = Math.ceil(area / blockSize);

  if (blocksValue > 0) {
    showResult(blocksValue)
  }
}

function clearWallData() {
  delete data['wall-width'];
  delete data['wall-height'];
  delete data['wall-length'];
  delete data['block-size'];
}

function showResult(blocks) {
  resultNumber.textContent = blocks
  result.classList.remove('hidden')
  body.classList.add('lock')
}

function hideResult() {
  data = {}
  body.classList.remove('lock')
  result.classList.add('hidden')
}

function restart() {
  window.location.reload()
}

function randomId() {
  return Math.random().toString(16).slice(2)
}

function addAperture(type) {
  const apertureGroup = document.createElement('div')
  apertureGroup.classList.add('form-group', 'form-group--opt', `form-group--${type}`)

  apertureGroup.innerHTML = `
    <div class="form-header">
      <h2 class="text-h2"></h2>
      <button class="btn btn--tertiary" type="button">Убрать из расчётов</button>
    </div>
    <div class="form-field form-field--area">
      <label class="form-field__label">Площадь</label>
      <input class="form-field__input" name="aperture-area-${randomId()}" type="number" step="0.01" min="1" placeholder="0"
        required>
    </div>
  `

  formInner.appendChild(apertureGroup)
}

// удаляю поля проемов по нажатию на кнопку
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn--tertiary')) {
    const parent = event.target.closest('.form-group--opt')
    parent.remove()
  }
})

// собираю данные из формы
form.addEventListener('submit', (event) => {
  event.preventDefault();

  new FormData(form).forEach((value, key) => {
    data[key] = +value
  })

  calculate(data);
});

// регистрирую сервис-воркер для возможности скачивать калькулятор
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/pwa.js")
      .then(res => console.log("приложение зарегистрировано"))
      .catch(err => console.log("не удалось зарегистрировать", err))
  })
}
