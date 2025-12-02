/* -----------------------------------------------------
   ASSETS — using YOUR FULL ORIGINAL FILENAMES
----------------------------------------------------- */

const assets = {
    straight: [
        "black", "blonde", "red", "brown", "white", "pink"
    ],

    wavy: [
        "black", "blonde", "red", "brown", "white", "pink"
    ],

    eyes: [
        "brown", "blue", "green", "hazel", "purple",
        "red", "violet", "lightblue"
    ],

    skin: [
        "white", "tan", "brown", "brown2", "dark", "dark2"
    ]
};

/* These colors match your original image sets */
const swatchColors = {
    black: "#000",
    blonde: "#e2c773",
    red: "#b43424",
    brown: "#6b3e2e",
    white: "#e8e8e8",
    pink: "#ff75c7",

    black: "#000",
    blonde: "#e2c773",
    red: "#b43424",
    brown: "#6b3e2e",
    white: "#e8e8e8",
    pink: "#ff75c7",

    blue: "#4a76ff",
    green: "#3dad3a",
    hazel: "#a47137",
    purple: "#a163f7",
    red_eye: "#e63946",
    violet: "#8a4fff",
    lightblue: "#79c7ff",

    tan: "#d1a074",
    brown2: "#8c6239",
    dark: "#4a3320",
    dark2: "#2e1d12"
};

/* -----------------------------------------------------
   ELEMENT REFERENCES
----------------------------------------------------- */

const skinImg  = document.getElementById("skin");
const eyesImg  = document.getElementById("eyes");
const browsImg = document.getElementById("brows");
const hairImg  = document.getElementById("hair");
const bangsImg = document.getElementById("bangs");
const dollContainer = document.querySelector(".doll-container");


/* -----------------------------------------------------
   BUILD BUTTONS
----------------------------------------------------- */

function createButtons(category, containerID) {
    const container = document.getElementById(containerID);
    assets[category].forEach(key => {
        const colorKey = key.toLowerCase();
        const swatch = swatchColors[colorKey] || "#ccc";

        const btn = document.createElement("div");
        btn.className = "color-btn";
        btn.style.background = swatch;
        btn.dataset.value = key;

        btn.onclick = () => {
            [...container.children].forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            applySelection(category, key);
        };

        container.appendChild(btn);
    });
}

createButtons("straight", "hairstyle-buttons");
createButtons("wavy", "wavy-hair-buttons");
createButtons("eyes", "eyes-buttons");
createButtons("skin", "skin-buttons");

/* -----------------------------------------------------
   APPLY OPTION SELECTION
----------------------------------------------------- */

function applySelection(category, key) {

    // Hair = hair + bangs + brows
    if (category === "straight") {
        hairImg.src  = `hair/hair${key}.png`;
        bangsImg.src = `bangs/bangs${key}.png`;
        browsImg.src = `brows/lash${key}.png`;
    }

    if (category === "wavy") {
        hairImg.src  = `hair/wavy${key}.png`;
        bangsImg.src = `bangs/wavyb${key}.png`;
        browsImg.src = `brows/lash${key}.png`;
    }

    if (category === "eyes") {
        eyesImg.src = `eyes/eye${key}.png`;
    }

    if (category === "skin") {
        skinImg.src = `skin/skin${key}.png`;
    }
}

/* -----------------------------------------------------
   BACKGROUND OPTIONS
----------------------------------------------------- */

let currentBackground = "transparent";
let uploadedBackground = null;

document.querySelectorAll(".bg-option").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".bg-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        uploadedBackground = null;
        currentBackground = btn.dataset.color;

        updateBackground();
    };
});

function updateBackground() {
    if (uploadedBackground) {
        dollContainer.style.background = `url(${uploadedBackground}) center / cover`;
        return;
    }

    if (currentBackground === "transparent") {
        dollContainer.style.background = "transparent";
    } else {
        dollContainer.style.background = currentBackground;
    }
}

/* GRADIENT */
document.getElementById("gradient-apply").onclick = () => {
    const c1 = document.getElementById("grad-color1").value;
    const c2 = document.getElementById("grad-color2").value;
    const dir = document.getElementById("grad-direction").value;

    uploadedBackground = null;

    currentBackground =
        dir === "vertical"
            ? `linear-gradient(${c1}, ${c2})`
            : `linear-gradient(to right, ${c1}, ${c2})`;

    dollContainer.style.background = currentBackground;
};

/* UPLOAD BACKGROUND */
document.getElementById("upload-bg").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        uploadedBackground = reader.result;
        dollContainer.style.background = `url(${reader.result}) center/cover`;
    };
    reader.readAsDataURL(file);
};

/* -----------------------------------------------------
   DOWNLOAD PNG
----------------------------------------------------- */

document.getElementById("downloadBtn").onclick = downloadPNG;

async function downloadPNG() {
    const layers = [
    hairImg,   // 1
    eyesImg,   // 2
    skinImg,   // 3
    browsImg,  // 4
    bangsImg   // 5
];

    await Promise.all(layers.map(waitForLoad));

    const w = skinImg.naturalWidth;
    const h = skinImg.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    /* BACKGROUND */
    if (uploadedBackground) {
        const img = await loadImage(uploadedBackground);
        ctx.drawImage(img, 0, 0, w, h);
    } else if (currentBackground === "transparent") {
        // do nothing
    } else if (currentBackground.includes("linear-gradient")) {
        ctx.drawImage(createGradientCanvas(currentBackground, w, h), 0, 0);
    } else {
        ctx.fillStyle = currentBackground;
        ctx.fillRect(0, 0, w, h);
    }

    /* DRAW LAYERS */
    for (const layer of layers) {
        ctx.drawImage(layer, 0, 0);
    }

    /* EXPORT */
    const link = document.createElement("a");
    link.download = "my_doll.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/* -----------------------------------------------------
   HELPERS
----------------------------------------------------- */

function waitForLoad(img) {
    return new Promise(res => {
        if (img.complete && img.naturalWidth > 0) res();
        img.onload = () => res();
    });
}

function loadImage(src) {
    return new Promise(res => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = src;
    });
}

function createGradientCanvas(gradient, w, h) {
    const cvs = document.createElement("canvas");
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d");

    const colors = gradient.match(/#(?:[0-9a-f]{3}){1,2}/gi);
    const c1 = colors[0];
    const c2 = colors[1];

    let g;
    if (gradient.includes("right")) {
        g = ctx.createLinearGradient(0, 0, w, 0);
    } else {
        g = ctx.createLinearGradient(0, 0, 0, h);
    }

    g.addColorStop(0, c1);
    g.addColorStop(1, c2);

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    return cvs;
}
