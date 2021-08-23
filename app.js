const tasks = [
];

(function(arrOfTasks) {
  let objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };
  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default';

  //Elements UI 
  const listContainer = document.querySelector('.tasks-list-section .list-group');
  const form = document.forms['addTask']; 
  const formWrapper = document.querySelector('.card');
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  const themeSelect = document.getElementById('themeSelect');

  const error = document.createElement('span'); 
  error.textContent = 'Task list is empty :('
  error.style.color = 'red' 
  error.style.fontWeight = 'bold';

  

  //Events
  setTheme(lastSelectedTheme);
  themeSelect.value = lastSelectedTheme;
  
  if(localStorage.getItem('todo')) {
    objOfTasks = JSON.parse(localStorage.getItem('todo'));
    renderAllTasks(objOfTasks);
  } else {
    formWrapper.insertAdjacentElement('afterend', error); 
  }
  // renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  listContainer.addEventListener('click', onCompleteHandler);
  themeSelect.addEventListener('change', onThemeSelectHandler);

  function renderAllTasks(taskList) {
    if (!taskList) {
      console.error('Pass the task list');
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.values(taskList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  } 

  function listItemTemplate ({ _id, title, body, completed } = {}) {
    const li = document.createElement('li'); 
    li.classList.add(
      'list-group-item', 
      'd-flex', 
      'align-items-center', 
      'flex-wrap', 
      'mt-2'
    );
    li.setAttribute('data-task-id', _id);
    
    if(completed === true) {
      li.classList.add('list-group-item-success');
    }

    const span = document.createElement('span'); 
    span.textContent = title; 
    span.style.fontWeight = 'bold'; 

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Completed'; 
    completeBtn.classList.add(
      'btn', 
      'btn-success', 
      'ml-auto',
      'complete-btn'
    )

    const deleteBtn = document.createElement('button'); 
    deleteBtn.textContent = 'Delete task'; 
    deleteBtn.classList.add(
      'btn', 
      'btn-danger', 
      'ml-auto',
      'delete-btn'
    );

    const article = document.createElement('p');
    article.textContent = body; 
    article.classList.add(
      'mt-2', 
      'w-100'
    ); 

    li.appendChild(span); 
    li.appendChild(deleteBtn); 
    li.appendChild(article); 
    li.appendChild(completeBtn);
    
    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault(); 
    const titleValue = inputTitle.value; 
    const bodyValue = inputBody.value;

    if(!titleValue || !bodyValue) {
      alert("Please, enter title and body");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);

    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title, 
      body, 
      completed: false, 
      _id: `task-${Math.random()}`
    }; 

    objOfTasks[newTask._id] = newTask;
    localStorage.setItem('todo', JSON.stringify(objOfTasks));
    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Do you really want to delete task: "${title}" ?`);
      
    if(!isConfirm) {
      return isConfirm;
    } else {
      delete objOfTasks[id]; 
      localStorage.setItem('todo', JSON.stringify(objOfTasks));
      return isConfirm; 
    }
  } 

  function deleteTaskFromHtml(confirmed, el) {
    if(!confirmed) return;
    el.remove();  
    if(!listContainer.children.length) formWrapper.insertAdjacentElement('afterend', error);  
  }

  function onDeleteHandler({ target }) {
    if(target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId; 
      const confirmed = deleteTask(id); 

      deleteTaskFromHtml(confirmed, parent);
    }
  } 

  function onCompleteHandler ({ target }) {
    if(target.classList.contains('complete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId; 
      const isCompleted = parent.classList.toggle('list-group-item-success')

      objOfTasks[id].completed = isCompleted;
      localStorage.setItem('todo', JSON.stringify(objOfTasks));
    }
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value; 
    const isConfirmed = confirm(`Are you sure want to change the theme on: ${selectedTheme}?`);

    if(!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    } 
    setTheme(selectedTheme);
    
    localStorage.setItem('app_theme', selectedTheme);
    lastSelectedTheme = selectedTheme;
  }

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
})(tasks);
