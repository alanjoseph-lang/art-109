const quizData = [
    {
        question: "What is the sharpest object?",
        options: [
            "Pinecone",
            "Thumbtack",
            "Fingernail",
            "Oven Mitt"
        ],
        correct: 1
    },
    {
       question: "Trapezing is what type of sport?",
        options: [
            "Gymnastics",
            "Aerobics",
            "Tightrope Walking",
            "Acrobatics"
        ],
        correct: 3
    },
    {
        question: "Which country is the largest exporter of softwood lumber?",
        options: [
            "Greenland",
            "USA",
            "Canada",
            "Sweden"
        ],
        correct: 2
    },
    {
        question: "What is a synonym for Prudent?",
        options: [
            "Tactical",
            "Precise",
            "Meticulous",
            "Precarious"
        ],
        correct: 0
    },
    {
        question: "What micronutrient is added to table salt?",
        options: [
            "Bromine",
            "Iodine",
            "Sodium duhhhhh",
            "Unobtanium"
        ],
        correct: 1
    },
    {
        question: "What feline species can jump the highest?",
        options: [
            "Cheetah",
            "Carcal",
            "Tiger",
            "Leopard"
        ],
        correct: 1
    },
    {
        question: "What fruit has the least amount of cyadine in it's seeds?",
        options: [
            "Cherry",
            "Peach",
            "Watermelon",
            "Apple"
        ],
        correct: 3
    },
    {
        question: "What citrus fruit is a hybrid of citron and sour orange?",
        options: [
            "Clementine",
            "Grapefruit",
            "Lemon",
            "Yuzu"
        ],
        correct: 2
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