// Fireworks Animation System
(function() {
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10000';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Firework particle class
  class Particle {
    constructor(x, y, vx, vy, color, life) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.life = life;
      this.maxLife = life;
      this.gravity = 0.1;
      this.friction = 0.99;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.life--;
    }

    draw() {
      const alpha = this.life / this.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.min(alpha * 1.2, 1); // Tăng độ sáng
      ctx.fillStyle = this.color;
      
      // Add glow effect - tăng độ sáng
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); // Tăng kích thước từ 2 lên 3
      ctx.fill();
      
      // Vẽ thêm lớp sáng bên trong
      ctx.shadowBlur = 10;
      ctx.globalAlpha = Math.min(alpha * 0.8, 0.8);
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    isDead() {
      return this.life <= 0;
    }
  }

  // Firework class
  class Firework {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      this.colors = [
        '#ff006c', '#ff417d', '#00ffff', '#ffff00', 
        '#ff6b6b', '#00ff00', '#ff00ff', '#ff9ff3',
        '#ffffff', '#ffaa00', '#00ffaa', '#ff0088'
      ];
      this.explode();
    }

    explode() {
      const particleCount = 80 + Math.random() * 70; // Tăng từ 50-100 lên 80-150
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const life = 60 + Math.random() * 40;
        
        this.particles.push(
          new Particle(this.x, this.y, vx, vy, color, life)
        );
      }
    }

    update() {
      this.particles = this.particles.filter(particle => {
        particle.update();
        return !particle.isDead();
      });
    }

    draw() {
      this.particles.forEach(particle => particle.draw());
    }

    isDead() {
      return this.particles.length === 0;
    }
  }

  // Fireworks manager
  const fireworks = [];
  let lastFireworkTime = 0;
  const fireworkInterval = 800; // Giảm từ 2000ms xuống 800ms để pháo hoa xuất hiện thường xuyên hơn

  function createRandomFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.1; // Upper 60% of screen
    fireworks.push(new Firework(x, y));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create new firework at random intervals - tăng mật độ
    const currentTime = Date.now();
    if (currentTime - lastFireworkTime > fireworkInterval + Math.random() * 500) {
      // Tạo 1-3 pháo hoa cùng lúc để tăng mật độ
      const count = 1 + Math.floor(Math.random() * 2); // 1-2 pháo hoa mỗi lần
      for (let i = 0; i < count; i++) {
        createRandomFirework();
      }
      lastFireworkTime = currentTime;
    }

    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      
      if (fireworks[i].isDead()) {
        fireworks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  // Start animation
  setTimeout(() => {
    animate();
    // Create initial firework
    createRandomFirework();
  }, 500);
})();

