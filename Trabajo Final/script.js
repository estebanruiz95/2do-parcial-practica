// Elementos del DOM
// Seleccionamos los elementos del DOM necesarios para manejar el formulario y sus interacciones
//selecciona elementos 
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

// Estado de error
let isError = false; // Variable para rastrear errores en las entradas

// Función para limpiar entradas
// Quita caracteres no deseados como '+' y '-' de las entradas de texto
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Verificar entradas inválidas
// Comprueba si el valor ingresado contiene formatos inválidos, como notación científica (e.g., 1e3)
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Función para agregar entrada
// Agrega una nueva entrada de comida o ejercicio según la opción seleccionada en el menú desplegable
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  // Estructura HTML de la nueva entrada con campos para nombre y calorías
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entrada ${entryNumber} Nombre</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Nombre" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entrada ${entryNumber} Calorías</label>
    <input
      type="number"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calorías"
      min="0"
    />
  `;

  // Inserta la nueva entrada en el contenedor correspondiente
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// Obtener calorías de entradas
// Suma las calorías de una lista de entradas, limpiando y validando cada entrada
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value); // Limpiamos la entrada
    const invalidInputMatch = isInvalidInput(currVal); // Verificamos si es inválida

    // Si la entrada es inválida, mostramos una alerta y establecemos isError a true
    if (invalidInputMatch) {
      alert(`Entrada inválida: ${invalidInputMatch[0]}`);
      isError = true;
      return null; // Salimos de la función
    }
    calories += Number(currVal); // Sumamos las calorías si la entrada es válida
  }
  return calories;
}

// Función para calcular calorías
// Calcula las calorías consumidas y quemadas, y muestra el balance de calorías restantes
function calculateCalories(e) {
  e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
  isError = false; // Reinicia el estado de error

  // Obtenemos las calorías de cada sección de comida y ejercicio
  const breakfastCalories = getCaloriesFromInputs(document.querySelectorAll('#breakfast input[type="number"]'));
  const lunchCalories = getCaloriesFromInputs(document.querySelectorAll('#lunch input[type="number"]'));
  const dinnerCalories = getCaloriesFromInputs(document.querySelectorAll('#dinner input[type="number"]'));
  const snacksCalories = getCaloriesFromInputs(document.querySelectorAll('#snacks input[type="number"]'));
  const exerciseCalories = getCaloriesFromInputs(document.querySelectorAll('#exercise input[type="number"]'));
  const budgetCalories = Number(budgetNumberInput.value); // Presupuesto diario de calorías

  // Si se detectó un error, detenemos la ejecución
  if (isError) return;

  // Calculamos las calorías consumidas y las restantes, considerando el ejercicio
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Superávit' : 'Déficit';

  // Actualizamos la salida con el balance de calorías, presupuesto, consumido y quemado
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorías ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calorías Presupuestadas</p>
    <p>${consumedCalories} Calorías Consumidas</p>
    <p>${exerciseCalories} Calorías Quemadas</p>
  `;
  output.classList.remove('hide'); // Mostramos la sección de resultados
}

// Función para limpiar formulario
// Limpia todas las entradas del formulario y oculta la salida de resultados
function clearForm() {
  // Vacía el contenido de cada contenedor de entradas de comida y ejercicio
  document.querySelectorAll('.input-container').forEach(container => (container.innerHTML = ''));
  budgetNumberInput.value = ''; // Limpia el campo de presupuesto
  output.innerHTML = ''; // Limpia el contenido de la salida
  output.classList.add('hide'); // Oculta la salida de resultados
}

// Asignamos eventos a los botones de agregar entrada, calcular calorías y limpiar formulario
addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);
