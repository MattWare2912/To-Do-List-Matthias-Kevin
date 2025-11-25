document.addEventListener('DOMContentLoaded', () => {
  const liste = document.getElementById('Liste');
  const addBtn = document.getElementById('add-btn');
  const newTaskInput = document.getElementById('new-task');

  // Charger les tâches depuis localStorage
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(text => createTask(text));

  // Action du bouton ➕
  addBtn.addEventListener('click', () => {
    const text = newTaskInput.value.trim();
    if (text !== "") {
      createTask(text);
      saveTasks();
      newTaskInput.value = ""; // vider le champ
    }
  });

  // Permet d'ajouter avec la touche "Enter"
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  function createTask(text) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const title = document.createElement('span');
    title.textContent = text;

    // ✅ Barrer le texte si coché
    checkbox.addEventListener('change', () => {
      title.classList.toggle('completed', checkbox.checked);
      saveTasks();
    });

    left.appendChild(checkbox);
    left.appendChild(title);

    //Bouton édit
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'edit-btn';

    editBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = title.textContent;

      // Quand on valide (blur ou Enter), on recrée un <span>
      function validateEdit() {
        const newTitle = document.createElement('span');
        newTitle.textContent = input.value.trim() || 'Sans titre';

        // Réattacher le bouton éditer au nouveau span
        left.replaceChild(newTitle, input);
        title = newTitle; // mettre à jour la référence
        saveTasks();
      }

      input.addEventListener('blur', validateEdit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          validateEdit();
        }
      });

      left.replaceChild(input, title);
      input.focus();
    });

    // 🗑️ Bouton poubelle
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
      taskCard.classList.add('removing');
      taskCard.addEventListener('animationend', () => {
        liste.removeChild(taskCard);
        saveTasks();
      }, { once: true });
    });

    taskCard.appendChild(left);

// Créer un conteneur pour les boutons
const actions = document.createElement('div');
actions.className = 'task-actions';

actions.appendChild(editBtn);
actions.appendChild(deleteBtn);

// Ajouter le conteneur à la carte
taskCard.appendChild(actions);

liste.appendChild(taskCard);

  }

  // 💾 Sauvegarde
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#Liste .task-left span').forEach(span => {
      tasks.push(span.textContent);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});






