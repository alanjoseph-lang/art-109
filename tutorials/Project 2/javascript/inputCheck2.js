document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("passwordlog");
    const answerInput = document.getElementById("answer");
    const submitButton = document.querySelector(".input-box .submit");
    const inputBox = document.querySelector(".input-box");

    const correctPassword = "TACTICAL";
    const correctAnswer = "CHESSBOARD";

    submitButton.addEventListener("click", () => {
        const passwordValue = passwordInput.value.trim().toLowerCase();
        const answerValue = answerInput.value.trim().toLowerCase();

        passwordInput.style.border = "2px solid #ccc";
        answerInput.style.border = "2px solid #ccc";

        let passwordCorrect = passwordValue === correctPassword.toLowerCase();
        let answerCorrect = answerValue === correctAnswer.toLowerCase();

        if (!passwordCorrect) {
            passwordInput.style.border = "2px solid red";
        }
        if (!answerCorrect) {
            answerInput.style.border = "2px solid red";
        }
        if (passwordCorrect && answerCorrect) {
            inputBox.innerHTML = `
                <h2 style="color: lightgreen; text-align:center;">Congrats, you passed!</h2>
            `;
        } else {
            submitButton.textContent = "Try Again";
            submitButton.style.backgroundColor = "rgb(100, 50, 50)";
            setTimeout(() => {
                submitButton.textContent = "Submit";
                submitButton.style.backgroundColor = "rgb(43, 43, 43)";
            }, 1500);
        }
    });

    [passwordInput, answerInput].forEach(input => {
        input.addEventListener("input", () => {
            input.style.border = "2px solid #ccc";
        });
    });
});