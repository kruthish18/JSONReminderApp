// Load the JSON data using XHR object and parse it
const xhr = new XMLHttpRequest();
let reminders;

// function to display detailed view of reminders
function showReminderDetails(parentDiv, reminder) {
  // Create the detailed view element
  const detailsEl = document.createElement('div');
  detailsEl.classList.add('reminder-details');

  let status = '';
  if (reminder.status === 'open') {
    status = status + "Status is InComplete";
  }
  else {
    status = status + "Status is Completed";
  }

  detailsEl.innerHTML = `
  <p>${reminder.name}<p>
  <p>${reminder.details}</p>
  <p>${reminder.time}</p>
  <p>${status}</p>`;

  // Find the container element
  const container = document.querySelector('.reminders-container');

  // Replace the reminder element with the detailed view
  container.replaceChild(detailsEl, parentDiv);

  // Add a click event listener to the detailed view element to go back to the reminder list
  detailsEl.addEventListener('click', function () {
    container.replaceChild(parentDiv, detailsEl);
  });
}

// Function to display reminders on the webpage
function displayReminders(reminders) {
  // Find the container element
  const container = document.querySelector('.reminders-container');

  // Clear the container
  container.innerHTML = '';

  // Loop through each reminder in the list and create a DOM element for it
  for (let i = 0; i < reminders.length; i++) {
    const reminder = reminders[i];

    // Create a parent div to hold the checkbox and the reminder text
    const parentDiv = document.createElement('div');
    parentDiv.classList.add('parent-div');
    // Create a reminder div to hold the reminder text
    const reminderDiv = document.createElement('div');
    reminderDiv.classList.add('reminder');
    reminderDiv.innerHTML = reminder.name;

    // Create a checkbox element to mark the reminder as completed or not
    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox-element');
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "completed");

    // If the reminder is not completed, set the checkbox to unchecked
    if (reminder?.status === 'open') {
      checkbox.checked = false;
    }
    // Otherwise, set the checkbox to checked
    else {
      checkbox.checked = true;
    }

    // Add the checkbox and the reminder text to the parent div
    parentDiv.appendChild(checkbox);
    parentDiv.appendChild(reminderDiv);
    // Add the parent div to the container
    container.appendChild(parentDiv);

    // Add a click event listener to the reminder element to show its detailed view
    reminderDiv.addEventListener('click', function () {
      showReminderDetails(parentDiv, reminder);
    });

    // Add a click event listener to the checkbox element to mark the reminder as completed or not
    checkbox.addEventListener('click', function () {
      // Update the complete property of the reminder object
      console.log(this.checked);
      if (this.checked == true) {
        reminder.status = 'completed';
        this.checked = true;
      }
      else {
        reminder.status = 'open';
        this.checked = false;
      }
    });
  }
}

// Open the JSON file and load the reminders
xhr.open('GET', 'test/data.json');
xhr.onload = function () {
  if (xhr.status === 200) {
    // Parse the JSON data and store it in the reminders array
    reminders = JSON.parse(xhr.responseText).reminders;
    // Display the reminders on the page
    displayReminders(reminders);
  }
}
xhr.send();


// Function to close the reminder form
function closeReminder(event) {

  let displayerrormsg = document.querySelector('.display-errormsg');
  displayerrormsg.innerHTML = ``;

  const formContainer = document.querySelector('.add-reminder-form');
  formContainer.style.display = 'none';
  event.preventDefault();

}

// Function to show the add reminder form
function showAddReminder() {
  let displayerrormsg = document.querySelector('.display-errormsg');
  displayerrormsg.innerHTML = ``;

  const formContainer = document.querySelector('.add-reminder-form');
  formContainer.style.display = 'block';
}

// Select the form element and add an event listener to prevent the default behavior of form submission
const reminderForm = document.querySelector('.add-reminder-form form');
reminderForm.addEventListener('submit', function (event) {
  addNewReminderObject(event);
  event.preventDefault();
});


function validatingFormInputs() {
  let nameInput = document.querySelector('.name-input');
  let descriptionInput = document.querySelector('.details-input');
  let timeInput = document.querySelector('.time-input');

  let displayerrormsg = document.querySelector('.display-errormsg');


  // Check if name input is not empty
  if (nameInput.value.trim() === '') {
    nameInput.classList.add('error');
    displayerrormsg.innerText = '!!!  Title is required.. Please Enter a Valid Title  !!! ';
    return false;
  }

  // Check if name input is between 3 and 20 characters
  if (nameInput.value.trim().length < 1 || nameInput.value.trim().length > 12) {
    nameInput.classList.add('error');
    displayerrormsg.innerText = '!!!  Title digits should be less than 12  !!! ';
    return false;
  }

  // Check if description input is not empty
  if (descriptionInput.value.trim() === '') {
    descriptionInput.classList.add('error');
    displayerrormsg.innerText = '!!!  Details are required.. Please Enter a Valid Description  !!! ';
    return false;
  }


  if (descriptionInput.value.trim().length < 3 || descriptionInput.value.trim().length > 20) {
    descriptionInput.classList.add('error');
    displayerrormsg.innerText = '!!!  Description digits should be less than 12   !!! ';
    return false;
  }


  // Check if time input is valid and not in the past
  let inputTime = new Date(timeInput.value);
  if (isNaN(inputTime.getTime()) || inputTime < new Date()) {
    timeInput.classList.add('error');
    displayerrormsg.innerText = '!!!  Invalid or past time   !!! ';
    return false;
  }

  return true;
}




// A Function to add a new reminder box
function addNewReminderObject(event) {

  let displayerrormsg = document.querySelector('.display-errormsg');
  displayerrormsg.innerHTML = ``;

  if (validatingFormInputs()) {
    event.preventDefault();
    const nameInput = document.querySelector('.name-input');
    const detailsInput = document.querySelector('.details-input');

    // Get the input value
    const inputDate = document.querySelector('.time-input').value;

    // Convert the input value to a Date object
    const date = new Date(inputDate);

    // Format the date and time string to the desired format
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Combine the formatted date and time strings
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    const reminder = {
      name: nameInput.value,
      details: detailsInput.value,
      time: formattedDateTime,
      status: 'open'
    };

    // Adding the new reminder to the reminder list
    reminders.push(reminder);

    // Clearing the input fields in the form 
    nameInput.value = '';
    detailsInput.value = '';

    let dateElement = document.createElement("input");
    let timespan = document.querySelector(".time-span");
    dateElement.setAttribute("type", "datetime-local");
    dateElement.setAttribute("name", "time");
    dateElement.setAttribute("class", "time-input");
    let oldDate = document.querySelector('.time-input');
    timespan.replaceChild(dateElement, oldDate);

    // After adding a new reminder, Hide the reminder form 
    const formContainer = document.querySelector('.add-reminder-form');
    formContainer.style.display = 'none';

    // Call the Display the updated reminder list
    displayReminders(reminders);
  }
  return false;
}

