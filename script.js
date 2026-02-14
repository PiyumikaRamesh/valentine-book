// ──────────────────────────────────────────────
//  PAGE DATA
// ──────────────────────────────────────────────
const pages = [
    {
        left: `
            <h2>Happy Valentine's Day</h2>
            <div class="valentine-wish">
                <p>
                    To every beautiful soul celebrating love today,<br><br>
                    May your heart be filled with warmth,<br>
                    may your day sparkle with joy,<br>
                    and may you feel deeply loved —<br>
                    even if only by the universe itself.<br><br>
                    <strong>Happy Valentine's Day to all of you!</strong>
                </p>
            </div>
        `,
        right: `
            <div class="quote" style="margin-top:20px;">
                "Love is not just for couples.<br>
                It is for every heart<br>that dares to feel."
            </div>
        `
    },
    {
        left: `
            <h2>A Wish For You</h2>
            <div class="valentine-wish">
                <p>
                    May you receive love in the most unexpected ways.<br><br>
                    May someone make you smile today.<br><br>
                    May you remember how worthy you are<br>
                    of all the beautiful things.<br><br>
                    You are someone's reason to smile.
                </p>
            </div>
        `,
        right: `
            <div class="quote">
                "The best and most beautiful things<br>
                in the world cannot be seen<br>
                or even touched — they must be<br>
                felt with the heart."<br><br>
                <span style="font-size:0.85em;color:#c96a7f;font-style:normal;letter-spacing:2px;">— Helen Keller</span>
            </div>
        `
    },
    {
        left: `
            <h2>One Last Wish</h2>
            <div class="valentine-wish">
                <p>
                    May your life be filled with<br>
                    little moments of love,<br>
                    gentle hugs, warm coffee,<br>
                    and quiet happiness.<br><br>
                    <strong>You are loved more than you know.</strong>
                </p>
            </div>
        `,
        right: `
            <h2 style="margin-bottom:0;">With Love ♡</h2>
            <canvas id="fireworks-canvas"></canvas>
            <button class="firework-btn" onclick="launchFireworks()">
                Light Up the Love ❤️
            </button>
        `
    }
];

// ──────────────────────────────────────────────
//  STATE & ELEMENTS
// ──────────────────────────────────────────────
let currentPage = 0;

const audio        = document.getElementById('romantic-song');
const cover        = document.getElementById('cover');
const book         = document.getElementById('book');
const leftContent  = document.getElementById('left-content');
const rightContent = document.getElementById('right-content');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');
const musicPlayer  = document.getElementById('music-player');
const musicIcon    = document.getElementById('music-icon');
const musicLabel   = document.getElementById('music-label');

let isPlaying = false;

// ──────────────────────────────────────────────
//  FLOATING HEARTS
// ──────────────────────────────────────────────
function createFloatingHearts(count) {
    const container = document.getElementById('hearts-container');
    const emojis = ['❤️', '💕', '💖', '💗', '💝', '🌸', '✨'];
    for (let i = 0; i < count; i++) {
        const h = document.createElement('div');
        const size = Math.random() * 26 + 14;
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.cssText = `
            position: absolute;
            font-size: ${size}px;
            left: ${Math.random() * 98}vw;
            bottom: -50px;
            opacity: ${Math.random() * 0.6 + 0.4};
            animation: floatHeart ${Math.random() * 5 + 6}s linear forwards;
            pointer-events: none;
        `;
        container.appendChild(h);
        setTimeout(() => h.remove(), 12000);
    }
}

// ──────────────────────────────────────────────
//  LOAD PAGE
// ──────────────────────────────────────────────
function loadPage(index) {
    const page = pages[index];

    leftContent.style.animation  = 'none';
    rightContent.style.animation = 'none';
    requestAnimationFrame(() => {
        leftContent.style.animation  = '';
        rightContent.style.animation = '';
        leftContent.innerHTML  = page.left;
        rightContent.innerHTML = page.right;
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;

    if (index === 2) {
        setTimeout(() => { initFireworks(); animateFireworks(); }, 400);
    }
}

// ──────────────────────────────────────────────
//  OPEN BOOK
// ──────────────────────────────────────────────
function openBook() {
    createFloatingHearts(25);
    cover.style.display = 'none';
    book.style.display  = 'block';
    loadPage(0);
    audio.volume = 0.65;
    audio.play().then(() => {
        isPlaying = true;
        musicLabel.textContent = '♪ Playing';
        musicIcon.textContent  = '♫';
    }).catch(() => {
        musicLabel.textContent = '♪ Tap to play';
    });
}

cover.addEventListener('click', openBook);

nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) { currentPage++; loadPage(currentPage); }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) { currentPage--; loadPage(currentPage); }
});

// Music toggle
musicPlayer.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => {
            isPlaying = true;
            musicLabel.textContent = '♪ Playing';
            musicIcon.textContent  = '♫';
        });
    } else {
        audio.pause();
        isPlaying = false;
        musicLabel.textContent = '♪ Paused';
        musicIcon.textContent  = '♩';
    }
});

// Periodic hearts while book is open
setInterval(() => {
    if (book.style.display === 'block') createFloatingHearts(5);
}, 4000);

// ──────────────────────────────────────────────
//  FIREWORKS
// ──────────────────────────────────────────────
let canvas, ctx, fireworks = [], particles = [], animId;

function initFireworks() {
    canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
}

function resizeCanvas() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width  = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);

class Firework {
    constructor() {
        this.x     = Math.random() * (canvas?.width || 300);
        this.y     = (canvas?.height || 300);
        this.sx    = (Math.random() - 0.5) * 3.5;
        this.sy    = -9 - Math.random() * 5;
        this.color = `hsl(${Math.random() * 60 + 330},100%,62%)`;
        this.life  = 55 + Math.random() * 20;
    }
    update() {
        this.x  += this.sx;
        this.y  += this.sy;
        this.sy += 0.22;
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
        this.x      = x;
        this.y      = y;
        this.color  = color;
        this.speedX = (Math.random() - 0.5) * 7;
        this.speedY = (Math.random() - 0.5) * 7;
        this.life   = 70 + Math.random() * 30;
        this.size   = Math.random() * 2 + 1;
    }
    update() {
        this.x      += this.speedX;
        this.y      += this.speedY;
        this.speedY += 0.12;
        this.life--;
    }
    draw() {
        ctx.globalAlpha = Math.max(0, this.life / 100);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function explode(x, y, color) {
    for (let i = 0; i < 50; i++) particles.push(new Particle(x, y, color));
}

window.launchFireworks = function () {
    if (!canvas) { initFireworks(); }
    for (let i = 0; i < 7; i++) {
        setTimeout(() => { if (canvas) fireworks.push(new Firework()); }, i * 140);
    }
    createFloatingHearts(15);
};

function animateFireworks() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...fireworks].forEach(f => { f.update(); f.draw(); });
    particles = particles.filter(p => {
        p.update();
        if (p.life > 0) { p.draw(); return true; }
        return false;
    });
    animId = requestAnimationFrame(animateFireworks);
}
