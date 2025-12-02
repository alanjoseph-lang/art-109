// Config
    const RECT_COUNT = 28;          // number of rectangles
    const BG_COLORS = ['#ffc0cb', '#ffa500', '#ffffff']; // pink, orange, white
    const BG_SWITCH_MS = 1600;      // how often background switches (ms)
    const MIN_W = 20, MAX_W = 160;  // rectangle width range
    const MIN_H = 12, MAX_H = 120;  // rectangle height range
    const MIN_SPEED = 0.6, MAX_SPEED = 4.0; // vertical speed (px per frame-ish)

    // Setup canvas
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    let DPR = window.devicePixelRatio || 1;

    function resize() {
      DPR = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * DPR);
      canvas.height = Math.round(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // scale drawing operations
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Utility
    function rand(min, max) { return Math.random() * (max - min) + min; }
    function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

    // Rectangle class
    class MovingRect {
      constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset(true);
      }

      reset(initial=false) {
        // Random size
        this.w = rand(MIN_W, MAX_W);
        this.h = rand(MIN_H, MAX_H);

        // Random horizontal position, allow partly offscreen for variety
        this.x = rand(-this.w * 0.2, this.canvasWidth - this.w * 0.8);

        // If initial placement, spread vertically across the screen; otherwise start above
        this.y = initial ? rand(-this.canvasHeight, this.canvasHeight) : -this.h - rand(0, this.canvasHeight * 0.5);

        // Speed: larger items might be slightly faster (or not) — leave as random for variety
        this.speed = rand(MIN_SPEED, MAX_SPEED);

        // Color: subtle palette to be visible on all backgrounds
        this.color = this.pickColor();
        // Optional: slight rotation (kept 0 for rectangular shape, but could be added later)
        this.rotation = 0;
      }

      pickColor() {
        // pick a color that will show on both light and bright backgrounds
        const palette = ['#1f2937', '#0f172a', '#111827', '#2b2b2b', '#3b3b3b'];
        return palette[randInt(0, palette.length - 1)];
      }

      update(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.y += this.speed;
        if (this.y > canvasHeight + 10) {
          this.reset(false);
          // ensure it starts a little above the top to create continuous flow
          this.y = -this.h - rand(0, canvasHeight * 0.25);
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        // Slight rounded corners for nicer look
        const r = Math.min(10, Math.min(this.w, this.h) * 0.15);
        roundedRect(ctx, this.x, this.y, this.w, this.h, r);
        ctx.fill();
        ctx.restore();
      }
    }

    // draw a rounded rectangle path into ctx
    function roundedRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // Create initial rectangles
    let rects = [];
    function makeRects() {
      rects = [];
      for (let i = 0; i < RECT_COUNT; i++) {
        rects.push(new MovingRect(window.innerWidth, window.innerHeight));
      }
    }
    makeRects();

    // When resizing, update rectangle canvas references (they use sizes on reset).
    window.addEventListener('resize', () => {
      // leave current positions but update known canvas size for behavior
      rects.forEach(r => { r.canvasWidth = window.innerWidth; r.canvasHeight = window.innerHeight; });
    });

    // Background logic
    let bgIndex = 0;
    let bgColor = BG_COLORS[bgIndex];

    setInterval(() => {
      bgIndex = (bgIndex + 1) % BG_COLORS.length;
      bgColor = BG_COLORS[bgIndex];
    }, BG_SWITCH_MS);

    // Animation loop
    function animate() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // update and draw rectangles
      for (let r of rects) {
        r.update(w, h);
        r.draw(ctx);
      }

      requestAnimationFrame(animate);
    }

    // Start
    requestAnimationFrame(animate);

    // Optional: allow clicking/tapping to add a burst of rectangles
    window.addEventListener('click', () => {
      for (let i = 0; i < 6; i++) {
        rects.push(new MovingRect(window.innerWidth, window.innerHeight));
        if (rects.length > 80) rects.shift(); // avoid unbounded growth
      }
    });