document.addEventListener('DOMContentLoaded', function() {
  fetchTrajetos(); // Carrega os trajetos ao inicializar a página
  setupAddNewTrajeto();
});

function setupAddNewTrajeto() {
  var addButton = document.getElementById('addTrajetoButton');
  if(addButton) {
      addButton.addEventListener('click', function() {
          clearModalInputs();
          document.getElementById('saveTrajeto').onclick = addNewTrajeto;
      });
  } else {
      console.error("Botão 'Adicionar Trajeto' não encontrado.");
  }
}

function clearModalInputs() {
  document.getElementById('origem').value = '';
  document.getElementById('destino').value = '';
  document.getElementById('horario').value = '';
  document.getElementById('diaSemana').value = 'Segunda-feira';
}

function fetchTrajetos() {
  fetch('https://trajetosserver.glitch.me/trajetos')
  .then(response => response.json())
  .then(data => {
      const tabela = document.getElementById('trajetoData');
      tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos trajetos
      data.forEach(trajeto => {
          const linha = `
              <tr>
                  <td>${trajeto.origem}</td>
                  <td>${trajeto.destino}</td>
                  <td>${trajeto.horario}</td>
                  <td>${trajeto.diaSemana}</td>
                  <td>
                      <button class="btn btn-info" onclick="editTrajeto('${trajeto.id}')">Editar</button>
                      <button class="btn btn-danger" onclick="deleteTrajeto('${trajeto.id}')">Deletar</button>
                  </td>
              </tr>`;
          tabela.innerHTML += linha;
      });
  })
  .catch(error => console.error('Erro ao buscar trajetos:', error));
}

function addNewTrajeto() {
  const trajeto = getTrajetoDataFromModal();
  fetch('https://trajetosserver.glitch.me/trajetos', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(trajeto)
  })
  .then(response => response.json())
  .then(() => {
      $('#trajetoModal').modal('hide');
      fetchTrajetos(); // Atualiza a tabela
  });
}

function editTrajeto(id) {
  fetch(`https://trajetosserver.glitch.me/trajetos/${id}`)
  .then(response => response.json())
  .then(data => {
      fillModalWithData(data);
      document.getElementById('saveTrajeto').onclick = function() {
          updateTrajeto(id);
      };
      $('#trajetoModal').modal('show');
  });
}

function fillModalWithData(data) {
  document.getElementById('origem').value = data.origem;
  document.getElementById('destino').value = data.destino;
  document.getElementById('horario').value = data.horario;
  document.getElementById('diaSemana').value = data.diaSemana;
}

function updateTrajeto(id) {
  const trajeto = getTrajetoDataFromModal();
  fetch(`https://trajetosserver.glitch.me/trajetos/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(trajeto)
  })
  .then(response => response.json())
  .then(() => {
      $('#trajetoModal').modal('hide');
      fetchTrajetos(); // Atualiza a tabela
  });
}

function deleteTrajeto(id) {
  fetch(`https://trajetosserver.glitch.me/trajetos/${id}`, {
      method: 'DELETE'
  }).then(() => {
      fetchTrajetos(); // Atualiza a tabela após deletar o trajeto
  });
}

function getTrajetoDataFromModal() {
  return {
      origem: document.getElementById('origem').value,
      destino: document.getElementById('destino').value,
      horario: document.getElementById('horario').value,
      diaSemana: document.getElementById('diaSemana').value
  };
} 