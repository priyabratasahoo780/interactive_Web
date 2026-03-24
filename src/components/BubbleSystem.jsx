import { useEffect, useRef } from 'react';

export default function BubbleSystem() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId;
    let bubbles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Bubble {
      constructor(x, y, fromCursor = false) {
        this.x = x ?? Math.random() * window.innerWidth;
        this.y = y ?? window.innerHeight + Math.random() * 200;
        this.r = fromCursor ? Math.random() * 8 + 3 : Math.random() * 12 + 4;
        this.vx = (Math.random() - 0.5) * (fromCursor ? 1.5 : 0.6);
        this.vy = -(Math.random() * (fromCursor ? 2.5 : 1.5) + 0.8);
        this.alpha = fromCursor ? 0.5 : Math.random() * 0.3 + 0.1;
        this.fromCursor = fromCursor;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx + Math.sin(this.phase + Date.now() * 0.001) * 0.5;
        this.y += this.vy;
        this.alpha -= this.fromCursor ? 0.008 : 0.002;
        this.phase += 0.02;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          this.x - this.r * 0.3, this.y - this.r * 0.3, 0,
          this.x, this.y, this.r
        );
        grad.addColorStop(0, "rgba(255,255,255,0.5)");
        grad.addColorStop(1, "rgba(0,212,255,0.1)");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,212,255,0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      isDead() { return this.alpha <= 0 || this.y < -50; }
    }

    const animateBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.12) bubbles.push(new Bubble());
      
      bubbles = bubbles.filter(b => !b.isDead());
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });
      
      animFrameId = requestAnimationFrame(animateBubbles);
    };

    const handleMouseMove = (e) => {
      if (Math.random() < 0.08) {
        bubbles.push(new Bubble(
          e.clientX + (Math.random() - 0.5) * 20, 
          e.clientY + (Math.random() - 0.5) * 20, 
          true
        ));
      }
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch && Math.random() < 0.15) {
        bubbles.push(new Bubble(touch.clientX, touch.clientY, true));
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Pause animation when tab is inactive
    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animFrameId);
      else animateBubbles();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    animateBubbles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      aria-hidden="true" 
    />
  );
}
