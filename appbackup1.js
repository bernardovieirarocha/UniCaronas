document.addEventListener('DOMContentLoaded', function() {
    fetchTrajetos(); // Carrega os trajetos ao inicializar a página
  });

  
  function fetchTrajetos() {
    fetch('http://localhost:3000/trajetos')
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
          tabela.innerHTML += linha; // Adiciona a linha à tabela
        });
      })
      .catch(error => console.error('Erro ao buscar trajetos:', error));
  }  
  
  // Função para adicionar um novo trajeto
  document.getElementById('saveTrajeto').addEventListener('click', function() {
    const trajeto = {
      origem: document.getElementById('origem').value,
      destino: document.getElementById('destino').value,
      horario: document.getElementById('horario').value,
      diaSemana: document.getElementById('diaSemana').value
    };
  
    fetch('http://localhost:3000/trajetos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trajeto)
    }).then(response => response.json())
      .then(data => {
        fetchTrajetos(); // Atualiza a tabela com o novo trajeto
        $('#trajetoModal').modal('hide'); // Fecha o modal após salvar
      });
  });
  
  // Função para deletar um trajeto
  function deleteTrajeto(id) {
    fetch(`http://localhost:3000/trajetos/${id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchTrajetos(); // Atualiza a tabela após deletar o trajeto
    });
  }
  
  // Função para carregar os dados do trajeto no formulário para edição
  function editTrajeto(id) {
    fetch(`http://localhost:3000/trajetos/${id}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('origem').value = data.origem;
        document.getElementById('destino').value = data.destino;
        document.getElementById('horario').value = data.horario;
        document.getElementById('diaSemana').value = data.diaSemana;
        $('#trajetoModal').modal('show'); // Abre o modal com os dados preenchidos
  
        // Mudança do evento do botão para atualizar ao invés de criar
        document.getElementById('saveTrajeto').onclick = function() {
          updateTrajeto(id); // Chama a função de atualização
        }
      });
  }
  
  
  // Função para atualizar um trajeto existente
  function updateTrajeto(id) {
    const trajeto = {
      origem: document.getElementById('origem').value,
      destino: document.getElementById('destino').value,
      horario: document.getElementById('horario').value,
      diaSemana: document.getElementById('diaSemana').value
    };
  
    fetch(`http://localhost:3000/trajetos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trajeto)
    }).then(response => response.json())
      .then(data => {
        fetchTrajetos(); // Atualiza a tabela com os dados modificados
        $('#trajetoModal').modal('hide'); // Fecha o modal após atualizar
      });
  }
  
  $('#trajetoModal').on('show.bs.modal', function (e) {
    // Resetando para comportamento padrão de adicionar novo trajeto
    document.getElementById('saveTrajeto').onclick = function() {
      const trajeto = {
        origem: document.getElementById('origem').value,
        destino: document.getElementById('destino').value,
        horario: document.getElementById('horario').value,
        diaSemana: document.getElementById('diaSemana').value
      };
  
      fetch('http://localhost:3000/trajetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trajeto)
      }).then(response => response.json())
        .then(data => {
          fetchTrajetos(); // Atualiza a tabela com o novo trajeto
          $('#trajetoModal').modal('hide'); // Fecha o modal após salvar
        });
    };
  });