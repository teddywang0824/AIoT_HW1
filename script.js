// ===== 即時時鐘 =====
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // 數字變化時加入 tick 動畫
  if (hoursEl.textContent !== hours) {
    hoursEl.textContent = hours;
    hoursEl.classList.add('tick');
    setTimeout(() => hoursEl.classList.remove('tick'), 150);
  }
  if (minutesEl.textContent !== minutes) {
    minutesEl.textContent = minutes;
    minutesEl.classList.add('tick');
    setTimeout(() => minutesEl.classList.remove('tick'), 150);
  }
  if (secondsEl.textContent !== seconds) {
    secondsEl.textContent = seconds;
    secondsEl.classList.add('tick');
    setTimeout(() => secondsEl.classList.remove('tick'), 150);
  }

  // 更新日期顯示
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日　星期${weekDays[now.getDay()]}`;
  document.getElementById('date-display').textContent = dateStr;

  // 更新圓環進度（以秒數為基準）
  const progress = now.getSeconds() / 60;
  const circumference = 2 * Math.PI * 90; // r=90
  const offset = circumference * (1 - progress);
  const ring = document.getElementById('ring-progress');
  if (ring) {
    ring.style.strokeDashoffset = offset;
  }
}

// 每秒更新
setInterval(updateClock, 1000);
updateClock();

// ===== 動態問候語 =====
function setGreeting() {
  const hour = new Date().getHours();
  const el = document.getElementById('greeting');
  if (hour >= 5 && hour < 12) {
    el.textContent = '早安 ☀️';
  } else if (hour >= 12 && hour < 17) {
    el.textContent = '午安 🌤️';
  } else if (hour >= 17 && hour < 21) {
    el.textContent = '晚安 🌅';
  } else {
    el.textContent = '夜深了 🌙';
  }
}
setGreeting();

// ===== 粒子背景動畫 =====
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() * 60 + 220; // 藍～紫色系
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // 依螢幕大小決定粒子數量
  function initParticleArray() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(animate);
  }

  initParticleArray();
  animate();

  // 視窗大小變更時重新初始化粒子
  window.addEventListener('resize', () => {
    initParticleArray();
  });
})();

// ===== 滾動進場動畫 (Intersection Observer) =====
document.addEventListener('DOMContentLoaded', () => {
  // 給需要動畫的元素加上 reveal class
  const revealTargets = document.querySelectorAll(
    '.clock-section, .info-card, .contact-section, .section-title'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ===== 導航列滾動特效 =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 80) {
    navbar.style.background = 'rgba(10, 10, 26, 0.92)';
    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(10, 10, 26, 0.7)';
    navbar.style.boxShadow = 'none';
  }

  lastScroll = currentScroll;
});
