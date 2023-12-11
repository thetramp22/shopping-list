import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL: 'https://playground-a74f3-default-rtdb.firebaseio.com/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const addButton = document.getElementById('add-button');
const inputField = document.getElementById('input-field');
const list = document.getElementById('shopping-list');

addButton.addEventListener('click', handleClick);

function handleClick() {
  let inputValue = inputField.value;

  push(shoppingListInDB, inputValue);

  clearInputField();
}

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let listArray = Object.entries(snapshot.val());

    clearList();

    for (let i = 0; i < listArray.length; i++) {
      let currentItem = listArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToList(currentItem);
    }
  } else {
    list.textContent = 'No Items Yet';
  }
});

function clearList() {
  list.innerHTML = '';
}

function appendItemToList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  const listEl = document.createElement('li');

  listEl.textContent = itemValue;

  listEl.addEventListener('click', function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  list.appendChild(listEl);
}

function clearInputField() {
  inputField.value = '';
}
