const quizData = [

    {
        question: "What do you call a triangle with 2 equal sides?",
        options: [
            "Equilateral",
            "Isosceles",
            "Scalene",
            "Obtuse"
        ],
        correct: 1
    },
    {
        question: "What is the name of this cold Korean buckwheat noodle dish?",
        options: [
            "Naengmyeon", 
            "Tsukemen", 
            "Jajangmyeon", 
            "Soondubu"
        ],
        correct: 0
    },
    {
        question: "What drugstore product is made from Petroleum byproduct?",
        options: [
            "Lip-Stick",
            "Benzoyl Peroxide",
            "Mineral Oil",
            "Vaseline"
        ],
        correct: 3
    },
    {
        question: "Violet from the Incredibles can turn.... ?",
        options: [
            "Water into Ice",
            "Into a Rat",
            "Invisible",
            "Around"
        ],
        correct: 2
    },
    {
        question: "What is the word for happy/benficial occurences of chance?",
        options: [
            "Wanderlust",
            "Serendipity",
            "Kismet",
            "Kinesis"
        ],
        correct: 1
    },
    {
        question: "What is the name of this Japanese dish made with Tofu skins stuffed with Sushi rice?",
        options: [
            "Sekihan",
            "Inari",
            "Sushi",
            "Onigiri"
        ],
        correct: 1
    },
    {
        question: "What baking ingredient plays a key role as a leavening (rising) agent and keeping gluten soft?",
        options: [
            "Corn Starch",
            "Milk",
            "Baking Soda",
            "Butter"
        ],
        correct: 3
    },
    {
        question: "What is the official term for tangible, publicized false statements?",
        options: [
            "Libel",
            "Slander",
            "Defamation",
            "Calumny"
        ],
        correct: 0
    },
    {
        question: "What species is the biggest victim of the Ivory Trade?",
        options: [
            "Rhino",
            "(Indian) Elephant",
            "(African) Elephant",
            "Sabertooth Tiger"
        ],
        correct: 3
    },
];

let current = 0;
let answeredCorrectly = Array(quizData.length).fill(false);

const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

function loadQuestion() {
    const q = quizData[current];
    questionText.textContent = q.question;
    optionsDiv.innerHTML = "";

    q.options.forEach((opt, i) => {
        const optDiv = document.createElement("div");
        optDiv.classList.add("option");
        optDiv.innerHTML = `
            <label>
                <input type="radio" name="option" value="${i}">
                <span class="bubble"></span> ${opt}
            </label>
        `;
        optionsDiv.appendChild(optDiv);
    });

    if (answeredCorrectly[current]) showCorrectAnswer();

    submitBtn.style.display = answeredCorrectly[current] ? "none" : "inline-block";
    nextBtn.style.display = answeredCorrectly[current] && current < quizData.length - 1 ? "inline-block" : "none";
    backBtn.style.display = current > 0 ? "inline-block" : "none";
}

function showCorrectAnswer() {
    const correctText = quizData[current].options[quizData[current].correct];
    optionsDiv.innerHTML = `
        <h3 class="correct-answer">
            <span class="first-letter">${correctText.charAt(0)}</span>${correctText.slice(1)}
        </h3>
    `;
}

submitBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return;

    const answerIndex = parseInt(selected.value);
    if (answerIndex === quizData[current].correct) {
        answeredCorrectly[current] = true;
        showCorrectAnswer();
        submitBtn.style.display = "none";
        nextBtn.style.display = current < quizData.length - 1 ? "inline-block" : "none";
    } else {
        const bubble = selected.parentElement.querySelector(".bubble");
        bubble.innerHTML = "❌";
        bubble.classList.add("wrong");
        submitBtn.textContent = "Retry";
    }
});

nextBtn.addEventListener("click", () => {
    if (current < quizData.length - 1) {
        current++;
        submitBtn.textContent = "Submit";
        loadQuestion();
    }
});

backBtn.addEventListener("click", () => {
    if (current > 0) {
        current--;
        loadQuestion();
    }
});

loadQuestion();