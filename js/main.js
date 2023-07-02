const _ = window._;

// Función para cargar los participantes desde el almacenamiento
async function loadParticipants() {
  try {
    const response = await fetch('./data/premios.json');
    const participants = await response.json();

    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';

    participants.forEach(function (participant) {
      const li = document.createElement('li');
      li.textContent = participant;
      participantsList.appendChild(li);
    });

    // Mostrar los participantes actualizados
    mostrarParticipantes();
  } catch (error) {
    console.error('Error al cargar los participantes:', error);
  }
}
// Función para guardar los participantes en el almacenamiento
function saveParticipants(participants) {
  localStorage.setItem('participants', JSON.stringify(participants));
}

// Obtén el elemento del input
const participantInput = document.getElementById('participantInput');
const addParticipantBtn = document.getElementById('addParticipantBtn');

function guardarParticipante() {
  // Obtiene el nombre del input y lo limpia de espacios en blanco al inicio y final
  const nombre = participantInput.value.trim();

  // Verifica si el nombre no está vacío
  if (nombre !== '') {
    // Verifica si hay datos previos en el LocalStorage
    const participantesPrevios = localStorage.getItem('participants');
    let participantes = [];

    if (participantesPrevios) {
      // Si hay datos previos, los parseamos del JSON al array
      participantes = JSON.parse(participantesPrevios);
    }

    // Agrega el nuevo nombre al array
    participantes.push(nombre);

    // Guarda el array en el LocalStorage
    localStorage.setItem('participants', JSON.stringify(participantes));

    // Limpia el valor del input
    participantInput.value = '';

    // Muestra los participantes actualizados
    mostrarParticipantes();
  }
}

// Asocia la función al evento de cambio del input
participantInput.addEventListener('change', guardarParticipante);

// Asocia la función al evento de click del botón
addParticipantBtn.addEventListener('click', guardarParticipante);

// Función para mostrar los participantes almacenados en el LocalStorage
function mostrarParticipantes() {
  // Obtiene el elemento de la lista
  const participantsList = document.getElementById('participantsList');

  // Verifica si hay datos previos en el LocalStorage
  const participantesPrevios = localStorage.getItem('participants');

  if (participantesPrevios) {
    // Si hay datos previos, los parseamos del JSON al array
    const participantes = JSON.parse(participantesPrevios);

    // Limpia la lista antes de mostrar los participantes
    participantsList.innerHTML = '';

    // Crea los elementos de lista y los agrega a la lista
    participantes.forEach(function(participante) {
      const li = document.createElement('li');
      li.textContent = participante;
      participantsList.appendChild(li);
    });
  } else {
    // Si no hay datos previos, muestra un mensaje de que no hay participantes
    participantsList.innerHTML = 'No hay participantes almacenados.';
  }
}

// Evento para mostrar la cantidad total de participantes
document.getElementById('showTotalBtn').addEventListener('click', function () {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  const totalParticipants = document.getElementById('totalParticipants');
  totalParticipants.textContent = 'Cantidad total de participantes: ' + participants.length;
});

// Evento para realizar el sorteo
document.getElementById('drawWinnerBtn').addEventListener('click', function () {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  const winnerResult = document.getElementById('winnerResult');

  if (participants.length > 0) {
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];
    winnerResult.textContent = '¡El ganador es: ' + winner + '!';

    // Cargar los premios desde el archivo JSON
    fetch('./data/premios.json')
      .then(response => response.json())
      .then(data => {
        const premios = data[0]; // Acceder al primer objeto del arreglo

        // Generar un índice aleatorio para seleccionar un premio
        const premioKeys = Object.keys(premios);
        const randomPrizeIndex = Math.floor(Math.random() * premioKeys.length);
        const premioKey = premioKeys[randomPrizeIndex];
        const prize = premios[premioKey];
        
        winnerResult.textContent += ' ¡Ha ganado un ' + prize + '!';
        borrarLocalStorageDespuesDe10Segundos(); //se agrega un nuevo participante y se visualiza que los datos anteriores no estan mas

      })
      .catch(error => {
        console.error('Error al cargar los premios:', error);
      });
  } else {
    winnerResult.textContent = 'No hay participantes para realizar el sorteo.';
  }
});


// Cargar los participantes al cargar la página
loadParticipants();

// Función para borrar toda la información del LocalStorage después de 10 segundos
function borrarLocalStorageDespuesDe10Segundos() {
  setTimeout(function () {
    localStorage.clear();
    console.log('LocalStorage borrado después de 10 segundos.');
  }, 10000); // 10 segundos (10000 milisegundos)
}


// Llamar a la función para borrar el LocalStorage después de 10 segundos
borrarLocalStorageDespuesDe10Segundos();

