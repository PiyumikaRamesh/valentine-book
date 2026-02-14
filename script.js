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
            <h2 style="text-align:center;margin-bottom:5px;margin-top:100px;">With Love</h2>
            
            <!-- NEW IMAGE -->
            <img src="assets/hart.png" class="romantic-final-img" alt="Love;">
            
            <canvas id="fireworks-canvas" width="460" height="480"></canvas>
            <div style="text-align:center;margin-top:-900px;">
                <button onclick="launchFireworks()" style="background:#ff8a9a;color:white;border:none;padding:18px 55px;border-radius:50px;font-size:1.3rem;cursor:pointer;">
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
const musicToggle = document.getElementById('music-toggle');

// Floating hearts
function createFloatingHearts(count) {
    const container = document.getElementById('hearts-container');
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.cssText = `position:absolute;font-size:${Math.random()*32+24}px;left:${Math.random()*100}vw;bottom:-60px;opacity:${Math.random()*0.7+0.4};animation:floatHeart ${Math.random()*4.5+5}s linear forwards;animation-delay:${Math.random()*1}s;`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 11000);
    }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes floatHeart { to { transform:translateY(-130vh) rotate(30deg); opacity:0; } }`;
document.head.appendChild(style);

// Load page
function loadPage(index) {
    const page = pages[index];
    leftContent.style.opacity = '0';
    rightContent.style.opacity = '0';
    setTimeout(() => {
        leftContent.innerHTML = page.left;
        rightContent.innerHTML = page.right;
        leftContent.style.opacity = '1';
        rightContent.style.opacity = '1';
        if (index === 2) setTimeout(launchFireworks, 700);
    }, 400);
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
}

// Fireworks + Responsive Canvas
let canvas, ctx, fireworks = [], particles = [];

function initFireworks() {
    canvas = document.getElementById('fireworks-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = Math.min(canvas.parentElement.offsetWidth * 0.92, 460);
    canvas.height = Math.min(canvas.parentElement.offsetHeight * 0.85, 480);
}

window.addEventListener('resize', resizeCanvas);

// Firework & Particle classes (full from your original)
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.sx = Math.random() * 3 - 1.5;
        this.sy = Math.random() * -12 - 8;
        this.color = `hsl(${Math.random()*60 + 330}, 100%, 60%)`;
        this.trail = [];
    }
    update() { /* same as your original */ }
    draw() { /* same as your original */ }
}

class Particle {
    constructor(x, y, color) { /* same as your original */ }
    update() { /* same */ }
    draw() { /* same */ }
}

function launchFireworks() {
    for (let i = 0; i < 7; i++) {
        setTimeout(() => fireworks.push(new Firework()), i * 120);
    }
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // (paste your full animation code here - same as before)
    requestAnimationFrame(animateFireworks);
}

// Open book
function openBook() {
    createFloatingHearts(40);
    cover.style.transform = 'perspective(1400px) rotateY(-105deg) translateX(-200px)';
    setTimeout(() => {
        cover.style.display = 'none';
        book.style.display = 'block';
        loadPage(0);
        audio.volume = 0.78;
        audio.play().catch(()=>{});
        initFireworks();
        animateFireworks();
    }, 1200);
}

cover.addEventListener('click', openBook);
nextBtn.addEventListener('click', () => { if (currentPage < pages.length-1) { currentPage++; loadPage(currentPage); createFloatingHearts(10); } });
prevBtn.addEventListener('click', () => { if (currentPage > 0) { currentPage--; loadPage(currentPage); } });

musicToggle.addEventListener('click', () => {
    if (isPlaying) { audio.pause(); musicToggle.innerHTML = `<i class="fas fa-play"></i>`; }
    else { audio.play(); musicToggle.innerHTML = `<i class="fas fa-pause"></i>`; }
    isPlaying = !isPlaying;
});

setInterval(() => { if (book.style.display === 'block') createFloatingHearts(8); }, 3800);

console.log('%c❤️ Happy Valentine\'s Day Wishes Ready ❤️', 'color:#ff8a9a;font-family:Dancing Script;font-size:20px');