import React from 'react';
import { Button } from '../atoms/Button';
import { ArrowRight } from 'lucide-react';

interface HeroGeometricProps {
  title1: string;
  title2: string;
  onGetStarted?: () => void;
}

export default function HeroGeometric({ title1, title2, onGetStarted }: HeroGeometricProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background geometric elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Geometric shapes */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-teal-400/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-4 h-16 bg-pink-400/30 rounded-full rotate-12 animate-pulse" />
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