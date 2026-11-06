// Important: Stores the planner tasks in an array
let myTasks = [];

function addTask() {
    let taskInput = document.getElementById("taskInput");
    if (!taskInput) return; 
    let text = taskInput.value.trim();

    if (text === "") {
        alert("Task cannot be empty!");
        return;
    }

    myTasks.push({ taskName: text, isDone: false });
    taskInput.value = ""; 
    renderTasks(); 
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    if (!taskList) return;
    taskList.innerHTML = ""; 

    for (let i = 0; i < myTasks.length; i++) {
        let listItem = document.createElement("li");
        
        if (myTasks[i].isDone === true) {
            listItem.classList.add("completed");
        }

        listItem.innerHTML = myTasks[i].taskName;

        let finishBtn = document.createElement("button");
        finishBtn.innerText = "Finish";
        finishBtn.style.marginLeft = "10px";
        finishBtn.style.backgroundColor = "green";
        finishBtn.onclick = function() {
            myTasks[i].isDone = !myTasks[i].isDone;
            renderTasks();
        };

        let delBtn = document.createElement("button");
        delBtn.innerText = "Remove";
        delBtn.style.marginLeft = "5px";
        delBtn.style.backgroundColor = "black";
        delBtn.onclick = function() {
            myTasks.splice(i, 1); 
            renderTasks();
        };

        listItem.appendChild(finishBtn);
        listItem.appendChild(delBtn);
        taskList.appendChild(listItem);
    }
}

// Important: Form validation logic for the contact page
let contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); 

        let nameValue = document.getElementById("name").value.trim();
        let emailValue = document.getElementById("email").value.trim();
        let phoneValue = document.getElementById("phone").value.trim();
        let messageValue = document.getElementById("message").value.trim();
        let feedback = document.getElementById("formFeedback");

        feedback.style.color = "red"; 

        if (nameValue === "" || emailValue === "" || phoneValue === "" || messageValue === "") {
            feedback.innerText = "Error: Please fill in all fields.";
            return;
        }

        if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1) {
            feedback.innerText = "Error: Email is invalid.";
            return;
        }

        let numbersOnly = /^[0-9]+$/.test(phoneValue); 
        if (numbersOnly === false) {
            feedback.innerText = "Error: Phone must be numbers only.";
            return;
        }

        feedback.style.color = "green";
        feedback.innerText = "Message sent successfully!";
        document.getElementById("contactForm").reset(); 
    });
}