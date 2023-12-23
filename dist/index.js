"use strict";
// Specifying arrays based on Task interface
let tasksList = [];
let completedTasksList = [];
let remainingTasksList = [];
// tasks counter
let allTasks = 0;
let completedTasksNumber = 0;
let remainingTaskNumber = 0;
// All Tasks counter -> changes the HTML element value
allTasksNumber(allTasks);
function allTasksNumber(allTasks) {
    let forNumbers = document.querySelector(".todo_header_tasks");
    if (allTasks < 0) {
        allTasks = 0;
    }
    forNumbers.innerHTML = `All Tasks (${allTasks})`;
}
// Complete tasks counter -> changes the HTML element value
completeTaskNumber(completedTasksNumber);
function completeTaskNumber(completedTasksNumber) {
    let forNumbers = document.querySelector(".todo_header_completed");
    if (completedTasksNumber < 0) {
        completedTasksNumber = 0;
    }
    forNumbers.innerHTML = `Completed (${completedTasksNumber})`;
}
// Remaining tasks counter -> changes the HTML element value
remainingTasksNumber(remainingTaskNumber);
function remainingTasksNumber(remainingTaskNumber) {
    let forNumbers = document.querySelector(".todo_header_remaining");
    if (remainingTaskNumber < 0) {
        remainingTaskNumber = 0;
    }
    forNumbers.innerHTML = `Remaining (${remainingTaskNumber})`;
}
// On add item click event, this function is called; input validation is checked and then further functions are called
function addTasks() {
    let userTaskInput = document.getElementById("task_input");
    if (!userTaskInput) {
        alert("Task input element not found!");
        return; // Exit the function early
    }
    let userTask = userTaskInput.value;
    if (userTask === "") {
        alert("Please enter a task!!!");
    }
    else {
        const taskObj = {
            id: getRandomString(ID_LENGTH),
            taskName: userTask,
            taskStatus: false,
        };
        tasksList.push(taskObj);
        // Initially every item is remaining
        remainingTasksList.push(taskObj);
        // increasing the counter
        allTasks++;
        allTasksNumber(allTasks);
        remainingTaskNumber++;
        remainingTasksNumber(remainingTaskNumber);
        updateTask();
        userTaskInput.value = "";
    }
}
function updateTask() {
    // for every add call, empty the bottom conainer to add new batch of tasks
    let bottomContainer = document.querySelector(".bottom_container");
    bottomContainer.style.backgroundColor = "#f9aa6a";
    bottomContainer.innerHTML = "";
    for (let i = 0; i < tasksList.length; i++) {
        let newTaskMainDiv = document.createElement("div");
        newTaskMainDiv.setAttribute("class", "tasks_details");
        let newTaskLeftDiv = document.createElement("div");
        newTaskLeftDiv.setAttribute("class", "left_todo");
        let newTaskRightDiv = document.createElement("div");
        newTaskRightDiv.setAttribute("class", "right_todo");
        let newTaskImg = document.createElement("img");
        if (tasksList[i].taskStatus) {
            newTaskImg.src = "./img/check-circle-fill.svg";
        }
        else {
            newTaskImg.src = "./img/circle.svg";
        }
        newTaskImg.onclick = () => {
            tasksList[i].taskStatus = !tasksList[i].taskStatus;
            updateTask();
        };
        let newTaskEl = document.createElement("span");
        newTaskEl.setAttribute("class", "task");
        newTaskEl.innerHTML = tasksList[i].taskName;
        let newTaskEdit = document.createElement("button");
        newTaskEdit.innerHTML = "Edit";
        let newTaskDelete = document.createElement("button");
        newTaskDelete.innerHTML = "Delete";
        newTaskDelete.onclick = () => {
            allTasks--;
            allTasksNumber(allTasks);
            if (remainingTasksList.some((task) => task.id === tasksList[i].id)) {
                const index = remainingTasksList.findIndex((task) => task.id === tasksList[i].id);
                remainingTasksList.splice(index, 1);
                remainingTaskNumber--;
                remainingTasksNumber(remainingTaskNumber);
            }
            if (completedTasksList.some((task) => task.id === tasksList[i].id)) {
                const index = completedTasksList.findIndex((task) => task.id === tasksList[i].id);
                completedTasksList.splice(index, 1);
                completedTasksNumber--;
                completeTaskNumber(completedTasksNumber);
            }
            tasksList.splice(i, 1);
            updateTask();
        };
        newTaskLeftDiv.appendChild(newTaskImg);
        newTaskLeftDiv.appendChild(newTaskEl);
        newTaskRightDiv.appendChild(newTaskEdit);
        newTaskRightDiv.appendChild(newTaskDelete);
        newTaskMainDiv.appendChild(newTaskLeftDiv);
        newTaskMainDiv.appendChild(newTaskRightDiv);
        if (tasksList[i].taskStatus) {
            // some() method checks for the presence of same id as tasklist[i].id
            // if not true -> then push
            if (!completedTasksList.some((task) => task.id === tasksList[i].id)) {
                completedTasksNumber++;
                completeTaskNumber(completedTasksNumber);
                completedTasksList.push(tasksList[i]);
            }
            // if true -> then remove
            if (remainingTasksList.some((task) => task.id === tasksList[i].id)) {
                const index = remainingTasksList.findIndex((task) => task.id === tasksList[i].id);
                remainingTasksList.splice(index, 1);
                remainingTaskNumber--;
                remainingTasksNumber(remainingTaskNumber);
            }
        }
        bottomContainer.appendChild(newTaskMainDiv);
    }
}
function completedTasks() {
    let bottomContainer = document.querySelector(".bottom_container");
    bottomContainer.innerHTML = "";
    bottomContainer.style.backgroundColor = "green";
    for (let i = 0; i < completedTasksList.length; i++) {
        let newTaskMainDiv = document.createElement("div");
        newTaskMainDiv.setAttribute("class", "tasks_details");
        let newTaskLeftDiv = document.createElement("div");
        newTaskLeftDiv.setAttribute("class", "left_todo");
        let newTaskRightDiv = document.createElement("div");
        newTaskRightDiv.setAttribute("class", "right_todo");
        let newTaskImg = document.createElement("img");
        newTaskImg.src = "./img/check-circle-fill.svg";
        newTaskImg.onclick = () => {
            completedTasksList[i].taskStatus = !completedTasksList[i].taskStatus;
            completedTasks();
        };
        let newTaskEl = document.createElement("span");
        newTaskEl.setAttribute("class", "task");
        newTaskEl.innerHTML = completedTasksList[i].taskName;
        let newTaskDelete = document.createElement("button");
        newTaskDelete.innerHTML = "Delete";
        newTaskDelete.onclick = () => {
            completedTasksNumber--;
            completeTaskNumber(completedTasksNumber);
            if (tasksList.some((task) => task.id === completedTasksList[i].id)) {
                const index = tasksList.findIndex((task) => task.id === completedTasksList[i].id);
                tasksList.splice(index, 1);
                allTasks--;
                allTasksNumber(allTasks);
            }
            completedTasksList.splice(i, 1);
            completedTasks();
        };
        newTaskLeftDiv.appendChild(newTaskImg);
        newTaskLeftDiv.appendChild(newTaskEl);
        newTaskRightDiv.appendChild(newTaskDelete);
        newTaskMainDiv.appendChild(newTaskLeftDiv);
        newTaskMainDiv.appendChild(newTaskRightDiv);
        if (!completedTasksList[i].taskStatus) {
            if (!remainingTasksList.some((task) => task.id === completedTasksList[i].id)) {
                remainingTaskNumber++;
                remainingTasksNumber(remainingTaskNumber);
                remainingTasksList.push(completedTasksList[i]);
            }
            completedTasksList.splice(i, 1);
            completedTasksNumber--;
            completeTaskNumber(completedTasksNumber);
            completedTasks();
        }
        else {
            bottomContainer.appendChild(newTaskMainDiv);
        }
    }
}
function remainingTasks() {
    let bottomContainer = document.querySelector(".bottom_container");
    bottomContainer.innerHTML = "";
    bottomContainer.style.backgroundColor = "#a875e8";
    for (let i = 0; i < remainingTasksList.length; i++) {
        let newTaskMainDiv = document.createElement("div");
        newTaskMainDiv.setAttribute("class", "tasks_details");
        let newTaskLeftDiv = document.createElement("div");
        newTaskLeftDiv.setAttribute("class", "left_todo");
        let newTaskRightDiv = document.createElement("div");
        newTaskRightDiv.setAttribute("class", "right_todo");
        let newTaskImg = document.createElement("img");
        newTaskImg.src = "./img/circle.svg";
        newTaskImg.onclick = () => {
            remainingTasksList[i].taskStatus = !remainingTasksList[i].taskStatus;
            remainingTasks();
        };
        let newTaskEl = document.createElement("span");
        newTaskEl.setAttribute("class", "task");
        newTaskEl.innerHTML = remainingTasksList[i].taskName;
        let newTaskEdit = document.createElement("button");
        newTaskEdit.innerHTML = "Edit";
        let newTaskDelete = document.createElement("button");
        newTaskDelete.innerHTML = "Delete";
        newTaskDelete.onclick = () => {
            remainingTaskNumber--;
            remainingTasksNumber(remainingTaskNumber);
            if (tasksList.some((task) => task.id === remainingTasksList[i].id)) {
                const index = tasksList.findIndex((task) => task.id === remainingTasksList[i].id);
                tasksList.splice(index, 1);
                allTasks--;
                allTasksNumber(allTasks);
            }
            remainingTasksList.splice(i, 1);
            remainingTasks();
        };
        newTaskLeftDiv.appendChild(newTaskImg);
        newTaskLeftDiv.appendChild(newTaskEl);
        newTaskRightDiv.appendChild(newTaskEdit);
        newTaskRightDiv.appendChild(newTaskDelete);
        newTaskMainDiv.appendChild(newTaskLeftDiv);
        newTaskMainDiv.appendChild(newTaskRightDiv);
        if (remainingTasksList[i].taskStatus) {
            if (!completedTasksList.some((task) => task.id === remainingTasksList[i].id)) {
                completedTasksNumber++;
                completeTaskNumber(completedTasksNumber);
                completedTasksList.push(remainingTasksList[i]);
            }
            remainingTasksList.splice(i, 1);
            remainingTaskNumber--;
            remainingTasksNumber(remainingTaskNumber);
            remainingTasks();
        }
        else {
            bottomContainer.appendChild(newTaskMainDiv);
        }
    }
}
// To get random id for each task entry
const ID_LENGTH = 8;
const NUMBER_SET = "0123456789";
const ALPHABET_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function getRandomString(length) {
    const characterSet = ALPHABET_SET + NUMBER_SET;
    let output = "";
    for (let i = 0; i < length; i++) {
        output += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
    }
    return output;
}
