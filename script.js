// ---------- Image fallback ----------
// 1) If an image is not found at its first path, try the other paths in its data-fallback list.
// 2) For the profile photo, if none of those work, look in the GitHub repository for ANY picture
//    (jpg, jpeg, png, webp, gif or avif), whatever it is called, and use it.
// 3) If nothing is found, show a neutral placeholder instead of a broken icon.
function showPlaceholder(img) {
    img.onerror = null;
    let label = img.classList.contains("profile-pic") ? "DO" : "Image";
    img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><rect width="300" height="150" fill="#cc0000"/>' +
        '<text x="150" y="85" text-anchor="middle" font-family="Arial" font-size="40" font-weight="700" fill="#fff">' +
        label + '</text></svg>');
}

// Works out the GitHub owner and repository from the site address,
// e.g. https://dave0369-rgb.github.io/WEBSITE-PROJECT/  ->  dave0369-rgb / WEBSITE-PROJECT
function getRepoInfo() {
    let host = window.location.hostname;
    if (!/\.github\.io$/i.test(host)) return null;
    let repo = window.location.pathname.split("/")[1];
    if (!repo) return null;
    return { owner: host.split(".")[0], repo: repo };
}

function pickBestPhoto(files) {
    let pictures = files.filter(function(f) {
        return f.type === "file" && /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name);
    });
    if (pictures.length === 0) return null;
    let preferred = pictures.filter(function(f) {
        return /passport|photo|profile|portrait|pic|image|me|dave|david/i.test(f.name);
    });
    return (preferred.length > 0 ? preferred : pictures)[0];
}

function findRepoPhoto(img, done) {
    let info = getRepoInfo();
    if (!info || !window.fetch) { done(false); return; }
    let base = "https://api.github.com/repos/" + info.owner + "/" + info.repo + "/contents/";
    function list(folder) {
        return fetch(base + folder).then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; });
    }
    list("").then(function(rootFiles) {
        let hit = Array.isArray(rootFiles) ? pickBestPhoto(rootFiles) : null;
        if (hit) return hit;
        return list("images").then(function(imgFiles) {
            return Array.isArray(imgFiles) ? pickBestPhoto(imgFiles) : null;
        });
    }).then(function(hit) {
        if (hit) { img.src = encodeURI(hit.path); done(true); } else { done(false); }
    });
}

function imgFallback(img) {
    let list = (img.getAttribute("data-fallback") || "").split("|").filter(function(p) { return p; });
    let tried = parseInt(img.getAttribute("data-tried") || "0", 10);
    if (tried < list.length) {
        img.setAttribute("data-tried", tried + 1);
        img.src = list[tried];
        return;
    }
    img.onerror = function() { showPlaceholder(img); };   // if the picture found below also fails
    if (img.classList.contains("profile-pic") && img.getAttribute("data-searched") !== "1") {
        img.setAttribute("data-searched", "1");
        findRepoPhoto(img, function(found) { if (!found) showPlaceholder(img); });
    } else {
        showPlaceholder(img);
    }
}
window.imgFallback = imgFallback;

// Images that already failed before this script loaded
document.querySelectorAll("img[data-fallback]").forEach(function(img) {
    if (img.complete && img.naturalWidth === 0) imgFallback(img);
});

// ---------- Mobile navigation menu ----------
let navToggle = document.getElementById("navToggle");
let navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
    navToggle.addEventListener("click", function() {
        let isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
}

// ---------- Animated counters on the home page ----------
function animateCounter(el) {
    let target = parseInt(el.getAttribute("data-target"), 10);
    let current = 0;
    let step = Math.max(1, Math.ceil(target / 30));
    let timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 40);
}

let counters = document.querySelectorAll(".stat-num");
if (counters.length > 0) {
    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function(c) { observer.observe(c); });
    } else {
        counters.forEach(function(c) { c.textContent = c.getAttribute("data-target"); });
    }
}

// ---------- Academic planner (tasks are saved in the browser) ----------
let STORAGE_KEY = "meddsnova_tasks";
let myTasks = [];

function loadTasks() {
    try {
        let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) myTasks = saved;
    } catch (e) {
        myTasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(myTasks));
    } catch (e) {
        // Storage may be blocked (private mode). The planner still works for this visit.
    }
}

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
    saveTasks();
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

        // textContent (not innerHTML) so typed text can never run as code
        let label = document.createElement("span");
        label.className = "task-text";
        label.textContent = myTasks[i].taskName;

        let finishBtn = document.createElement("button");
        finishBtn.type = "button";
        finishBtn.textContent = myTasks[i].isDone ? "Undo" : "Finish";
        finishBtn.className = "btn-finish";
        finishBtn.onclick = function() {
            myTasks[i].isDone = !myTasks[i].isDone;
            saveTasks();
            renderTasks();
        };

        let delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Remove";
        delBtn.className = "btn-remove";
        delBtn.onclick = function() {
            myTasks.splice(i, 1);
            saveTasks();
            renderTasks();
        };

        let buttons = document.createElement("div");
        buttons.className = "task-buttons";
        buttons.appendChild(finishBtn);
        buttons.appendChild(delBtn);

        listItem.appendChild(label);
        listItem.appendChild(buttons);
        taskList.appendChild(listItem);
    }

    let count = document.getElementById("taskCount");
    if (count) {
        let done = myTasks.filter(function(t) { return t.isDone; }).length;
        count.textContent = myTasks.length === 0
            ? "No tasks yet. Add your first one above."
            : done + " of " + myTasks.length + " tasks finished";
    }
}

let taskInputBox = document.getElementById("taskInput");
if (taskInputBox) {
    taskInputBox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") addTask();
    });
    loadTasks();
    renderTasks();
}

// ---------- Contact form validation ----------
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

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            feedback.innerText = "Error: Email is invalid.";
            return;
        }

        if (!/^[0-9]+$/.test(phoneValue)) {
            feedback.innerText = "Error: Phone must be numbers only.";
            return;
        }

        feedback.style.color = "green";
        feedback.innerText = "Message sent successfully!";
        contactForm.reset();
    });
}
