import { useEffect, useState, useRef } from 'react';
import { Button } from '../atoms/Button';
import { ArrowRight } from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
}

interface Connection {
  source: number;
  target: number;
  distance: number;
}

function ForceGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const colors = [
    'rgba(20, 184, 166, 0.6)',   // teal
    'rgba(168, 85, 247, 0.6)',   // purple
    'rgba(236, 72, 153, 0.6)',   // pink
    'rgba(59, 130, 246, 0.6)',   // blue
    'rgba(34, 197, 94, 0.6)',    // green
  ];

  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create nodes
    const nodeCount = 45;
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    // Spawn nodes evenly distributed within a circular area
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.4;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * maxRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      nodes.push({
        id: i,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      });
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120 && Math.random() > 0.75) {
          connections.push({
            source: i,
            target: j,
            distance: distance,
          });
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    }

    const startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      
      let dampingFactor = 0.998;
      let forceMultiplier = 1;
      
      if (elapsedTime > 3.0) {
        dampingFactor = 0.85;
        forceMultiplier = 0;
      }

      // Apply forces
      nodes.forEach((node, i) => {
        if (forceMultiplier > 0.001) {
          // Repulsion between nodes
          nodes.forEach((other, j) => {
            if (i !== j) {
              const dx = node.x - other.x;
              const dy = node.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0 && distance < 80) {
                const force = (0.005 / (distance * distance)) * forceMultiplier;
                node.vx += (dx / distance) * force;
                node.vy += (dy / distance) * force;
              }
            }
          });

          // Gentle attraction to center
          const centerX = dimensions.width / 2;
          const centerY = dimensions.height / 2;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          const attractionForce = elapsedTime < 3.5 ? 0.0003 : 0;
          node.vx += dx * attractionForce;
          node.vy += dy * attractionForce;
        }

        if (elapsedTime > 3.5) {
          node.vx = 0;
          node.vy = 0;
        } else {
          node.vx *= dampingFactor;
          node.vy *= dampingFactor;
          
          node.x += node.vx;
          node.y += node.vy;
        }

        // Boundary conditions
        if (node.x < 0 || node.x > dimensions.width) node.vx *= -0.3;
        if (node.y < 0 || node.y > dimensions.height) node.vy *= -0.3;
        
        node.x = Math.max(0, Math.min(dimensions.width, node.x));
        node.y = Math.max(0, Math.min(dimensions.height, node.y));
      });

      // Draw connections
      connections.forEach(connection => {
        const source = nodes[connection.source];
        const target = nodes[connection.target];
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(20, 184, 166, ${0.15 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Add subtle glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color.replace('0.6', '0.1');
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}

interface HeroGeometricProps {
  title1: string;
  title2: string;
  onGetStarted?: () => void;
}

export default function HeroGeometric({ title1, title2, onGetStarted }: HeroGeometricProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] via-transparent to-purple-500/[0.03] blur-3xl" />
      
      {/* Animated Force Graph */}
      <div className="absolute inset-0 overflow-hidden">
        <ForceGraph />
      </div>
      
      {/* Additional ambient background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-teal-500/8 to-teal-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-500/6 to-pink-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.4) 1px, transparent 0)`,
               backgroundSize: '60px 60px'
             }} 
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-obsidian dark:text-gray-100">
                {title1}
              </span>
              <span className="block text-gradient bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {title2}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform traditional education into personalized learning experiences that connect to what matters most to each student
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-12 py-6 group hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-12 py-6 hover:shadow-lg transition-all duration-300 border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400"
            >
              Watch Demo
            </Button>
          </div>

          {/* Scroll indicator hint */}
          <div className="pt-16">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scroll down to see our vision in action
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}