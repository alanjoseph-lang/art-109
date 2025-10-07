
document.addEventListener("DOMContentLoaded", () => {
    const puzzleLinks = [
        "puzzles/puzzle1.html",
        "puzzles/puzzle2.html",
        "puzzles/puzzle3.html"
    ];

    const randomPuzzleButton = document.getElementById("randomPuzzleButton");

    randomPuzzleButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        const randomLink = puzzleLinks[Math.floor(Math.random() * puzzleLinks.length)];
        window.location.href = randomLink;
    });
});