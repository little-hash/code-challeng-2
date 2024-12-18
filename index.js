    //lists 
    const addItemBtn = document.getElementById("addItemBtn");
    const clearListBtn = document.getElementById("clearListBtn");
    const itemInput = document.getElementById("itemInput");
    const itemList = document.getElementById("itemList");

    // Load the list from localStorage when the page is loaded
    window.onload = function() {
      loadList();
    };

    // Function to load the list from localStorage
    function loadList() {
      const storedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];
      storedItems.forEach(item => {
        createListItem(item.text, item.purchased, item.id);
      });
    }

    // Function to save the list to localStorage
    function saveList() {
      const items = [];
      document.querySelectorAll("li").forEach(item => {
        const text = item.textContent.replace("Mark Purchased", "").replace("Unmark", "").trim();
        const purchased = item.classList.contains("purchased");
        const id = item.dataset.id;
        items.push({ text, purchased, id });
      });
      localStorage.setItem("shoppingList", JSON.stringify(items));
    }

    // Function to add new item to the list
    function addItem() {
      const itemText = itemInput.value.trim();
      if (itemText) {
        createListItem(itemText);
        itemInput.value = ""; // Clear the input field
        saveList(); // Save the updated list to localStorage
      }
    }

    // Function to create a list item
    function createListItem(text, purchased = false, id = Date.now()) {
      const li = document.createElement("li");
      li.textContent = text;
      li.classList.toggle("purchased", purchased);
      li.dataset.id = id;

      // Create "Mark Purchased" button
      const markPurchasedBtn = document.createElement("button");
      markPurchasedBtn.textContent = purchased ? "Unmark" : "Mark Purchased";
      markPurchasedBtn.addEventListener("click", () => {
        li.classList.toggle("purchased");
        markPurchasedBtn.textContent = li.classList.contains("purchased") ? "Unmark" : "Mark Purchased";
        saveList(); // Save the updated list to localStorage
      });

      // Create "Edit" button
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        const newText = prompt("Edit item:", text);
        if (newText && newText.trim() !== text) {
          li.firstChild.textContent = newText;
          saveList(); // Save the updated list to localStorage
        }
      });

      // Create "Delete" button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        li.remove();
        saveList(); // Save the updated list to localStorage
      });

      li.appendChild(markPurchasedBtn);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      // Append the list item to the list
      itemList.appendChild(li);
    }

    // Attach event listener to the "Add" button to capture user input and add items to the list
    addItemBtn.addEventListener("click", addItem);

    // Attach event listener to the "Clear List" button to remove all items from the list
    clearListBtn.addEventListener("click", () => {
      itemList.innerHTML = "";
      
      // Remove items from localStorage
      localStorage.removeItem("shoppingList"); 
    });

    itemInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        addItemBtn.click();  
      }
    });
