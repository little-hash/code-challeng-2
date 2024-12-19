// Element references
const addButton = document.getElementById("addItemBtn");
const clearButton = document.getElementById("clearListBtn");
const inputField = document.getElementById("itemInput");
const listContainer = document.getElementById("itemList");

// Load saved list items when the page loads
window.onload = () => {
    loadSavedItems();
};

// Function to load list items from localStorage
function loadSavedItems() {
    const savedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];
    savedItems.forEach(({ text, purchased, id }) => {
        createListElement(text, purchased, id);
    });
}

// Function to save the current list to localStorage
function saveToLocalStorage() {
    const items = Array.from(document.querySelectorAll("li")).map((listItem) => {
        const text = listItem.textContent.replace("Mark Purchased", "").replace("Unmark", "").trim();
        const isPurchased = listItem.classList.contains("purchased");
        const id = listItem.dataset.id;
        return { text, purchased: isPurchased, id };
    });
    localStorage.setItem("shoppingList", JSON.stringify(items));
}

// Function to add a new item to the list
function addNewItem() {
    const itemText = inputField.value.trim();
    if (itemText) {
        createListElement(itemText);
        inputField.value = ""; // Clear the input field
        saveToLocalStorage(); // Save updated list
    }
}

// Function to create a new list item element
function createListElement(text, purchased = false, id = Date.now()) {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    listItem.classList.toggle("purchased", purchased);
    listItem.dataset.id = id;

    // Create "Mark Purchased" button
    const purchaseButton = document.createElement("button");
    purchaseButton.textContent = purchased ? "Unmark" : "Mark Purchased";
    purchaseButton.addEventListener("click", () => {
        listItem.classList.toggle("purchased");
        purchaseButton.textContent = listItem.classList.contains("purchased") ? "Unmark" : "Mark Purchased";
        saveToLocalStorage(); // Save updated list
    });

    // Create "Edit" button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        const updatedText = prompt("Edit item:", text);
        if (updatedText && updatedText.trim() !== text) {
            listItem.firstChild.textContent = updatedText;
            saveToLocalStorage(); // Save updated list
        }
    });

    // Create "Delete" button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        listItem.remove();
        saveToLocalStorage(); // Save updated list
    });

    // Append buttons to the list item
    listItem.appendChild(purchaseButton);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    // Add the list item to the container
    listContainer.appendChild(listItem);
}

// Add event listener to "Add" button
addButton.addEventListener("click", addNewItem);

// Add event listener to "Clear List" button
clearButton.addEventListener("click", () => {
    listContainer.innerHTML = "";
    localStorage.removeItem("shoppingList"); // Clear localStorage data
});

// Add event listener for pressing "Enter" in the input field
inputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addButton.click(); // Trigger the "Add" button
    }
});
