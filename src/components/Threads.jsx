import { useRef, useEffect } from 'react';

export default function Threads({
    color = [0.32, 0.15, 1],
    amplitude = 1.2,
    distance = 0,
    enableMouseInteraction = true
}) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const animationRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Convert color array to RGB
        const r = Math.floor(color[0] * 255);
        const g = Math.floor(color[1] * 255);
        const b = Math.floor(color[2] * 255);

        // Thread configuration
        const numThreads = 25;
        const threads = [];

        class Thread {
            constructor(yOffset, speedOffset) {
                this.yOffset = yOffset;
                this.speedOffset = speedOffset;
                this.points = [];
                this.numPoints = 100;

                for (let i = 0; i < this.numPoints; i++) {
                    this.points.push({ x: 0, y: 0 });
                }
            }

            update(time, mouseX, mouseY) {
                for (let i = 0; i < this.numPoints; i++) {
                    const t = i / (this.numPoints - 1);
                    const x = t * width * 1.2 - width * 0.1;

                    // Base wave
                    const wave1 = Math.sin((t * 4 + time * 0.5 + this.speedOffset) * Math.PI) * amplitude * 60;
                    const wave2 = Math.sin((t * 2 + time * 0.3 + this.speedOffset * 0.5) * Math.PI) * amplitude * 40;
                    const wave3 = Math.sin((t * 6 + time * 0.7 + this.speedOffset * 1.5) * Math.PI) * amplitude * 20;

                    // Mouse interaction
                    let mouseEffect = 0;
                    if (enableMouseInteraction) {
                        const distX = (x - mouseX * width) / width;
                        const distY = (this.yOffset - mouseY);
                        const dist = Math.sqrt(distX * distX + distY * distY);
                        mouseEffect = Math.exp(-dist * 3) * 50 * Math.sin(time * 2 + t * 10);
                    }

                    const y = height * (0.3 + this.yOffset * 0.4) + wave1 + wave2 + wave3 + mouseEffect;

                    this.points[i].x = x;
                    this.points[i].y = y;
                }
            }

            draw(ctx, alpha) {
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);

                for (let i = 1; i < this.points.length - 2; i++) {
                    const xc = (this.points[i].x + this.points[i + 1].x) / 2;
                    const yc = (this.points[i].y + this.points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
                }

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        // Create threads
        for (let i = 0; i < numThreads; i++) {
            const yOffset = i / numThreads;
            const speedOffset = i * 0.2;
            threads.push(new Thread(yOffset, speedOffset));
        }

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX / width;
            mouseRef.current.y = e.clientY / height;
        };

        if (enableMouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // Resize handler
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        let startTime = Date.now();

        const animate = () => {
            const time = (Date.now() - startTime) / 1000;

            ctx.clearRect(0, 0, width, height);

            threads.forEach((thread, i) => {
                thread.update(time, mouseRef.current.x, mouseRef.current.y);
                const alpha = 0.15 + (i / numThreads) * 0.4;
                thread.draw(ctx, alpha);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
            if (enableMouseInteraction) {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [color, amplitude, distance, enableMouseInteraction]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}
        />
    );
}
