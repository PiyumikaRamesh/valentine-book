const pages = [
    {
        left: `
            <div class="valentine-wish">
                <h2>Happy Valentine's Day</h2>
                <p>
                    To every beautiful soul celebrating love today,<br><br>
                    May your heart be filled with warmth,<br>
                    May your day sparkle with joy,<br>
                    And may you feel deeply loved <br>
                    even if only by the universe itself.<br><br>
                    <strong>Happy Valentine's Day to all of you!</strong>
                </p>
            </div>
        `,
        right: `
            <div class="quote" style="margin-top:40px;">
                Love is not just for couples.<br>
                It is for every heart that dares to feel.
            </div>
        `
    },
    {
        left: `
            <h2>A Wish For You</h2>
            <div class="valentine-wish">
                <p>
                    May you receive love in the most unexpected ways.<br>
                    May someone make you smile today.<br>
                    May you remember how worthy you are of all the beautiful things.<br><br>
                    You are someone's reason to smile.
                </p>
            </div>
        `,
        right: `
            <div class="quote">
                “The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.”<br><br>
                — Helen Keller
            </div>
        `
    },
    {
        left: `
            <h2 style="margin-bottom:40px;">One Last Wish</h2>
            <div class="valentine-wish">
                <p style="font-size:1.6rem;">
                    May your life be filled with little moments of love,<br>
                    gentle hugs, warm coffee, and quiet happiness.<br><br>
                    You are loved more than you know.
                </p>
            </div>
        `,
        right: `
            <h2 style="text-align:center;margin-bottom:0px;margin-top:0px;">With Love</h2>
            <img src="assets/hart.png" class="romantic-final-img" alt="Love;">
            <canvas id="fireworks-canvas"></canvas>
            <div style="text-align:center;margin-top:5px;">
                <button onclick="launchFireworks()" 
                    style="background:#ff8a9a;color:white;border:none;padding:18px 55px;border-radius:50px;font-size:1.3rem;cursor:pointer;">
                    Light Up the Love ❤️
                </button>
            </div>
        `
    }
];

let currentPage = 0;
let isPlaying = true;

const audio = document.getElementById('romantic-song');
const cover = document.getElementById('cover');
const book = document.getElementById('book');
const leftContent = document.getElementById('left-content');
const rightContent = document.getElementById('right-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Floating hearts
function createFloatingHearts(count) {
    const container = document.getElementById('hearts-container');
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.cssText = `
            position:absolute;
            font-size:${Math.random()*32+24}px;
            left:${Math.random()*100}vw;
            bottom:-60px;
            opacity:${Math.random()*0.7+0.4};
            animation:floatHeart ${Math.random()*4.5+5}s linear forwards;
        `;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes floatHeart {
    to { transform:translateY(-130vh) rotate(30deg); opacity:0; }
}`;
document.head.appendChild(style);

// Load page
function loadPage(index) {
    const page = pages[index];
    leftContent.innerHTML = page.left;
    rightContent.innerHTML = page.right;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;

    if (index === 2) {
        setTimeout(() => {
            initFireworks();
            animateFireworks();
        }, 300);
    }
}

// ================= FIREWORK SYSTEM =================

let canvas, ctx;
let fireworks = [];
let particles = [];

function initFireworks() {
    canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 250;
}


window.addEventListener('resize', resizeCanvas);

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.sx = (Math.random() - 0.5) * 3;
        this.sy = -10 - Math.random() * 4;
        this.color = `hsl(${Math.random()*60 + 330},100%,60%)`;
        this.life = 60;
    }

    update() {
        this.x += this.sx;
        this.y += this.sy;
        this.sy += 0.25;
        this.life--;

        if (this.life <= 0) {
            explode(this.x, this.y, this.color);
            fireworks.splice(fireworks.indexOf(this), 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.life = 80;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function explode(x, y, color) {
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function launchFireworks() {
    if (!canvas) return;
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            fireworks.push(new Firework());
        }, i * 150);
    }
}

function animateFireworks() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(f => {
        f.update();
        f.draw();
    });

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(animateFireworks);
}

// Open book
function openBook() {
    createFloatingHearts(30);
    cover.style.display = 'none';
    book.style.display = 'block';
    loadPage(0);
    audio.volume = 0.7;
    audio.play().catch(()=>{});
}

cover.addEventListener('click', openBook);
nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        loadPage(currentPage);
    }
});
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        loadPage(currentPage);
    }
});

setInterval(() => {
    if (book.style.display === 'block') createFloatingHearts(6);
}, 4000);
