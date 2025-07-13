import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import HeroGeometric from '../components/ui/hero-geometric';
import { 
  ArrowRight, 
  Zap,
  ChevronDown,
  Heart,
  Lightbulb,
  Code
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      // For now, just navigate to login - can implement demo login later
      navigate('/login');
    } catch (error) {
      console.error("Demo navigation failed:", error);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/10 overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={scrollToTop}>
            <img 
              src="/spool-logo.png" 
              alt="Spool Logo" 
              className="h-12 w-12 object-contain"
            />
            <span className="text-4xl font-bold text-obsidian dark:text-gray-100">Spool</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={scrollToAbout}
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={scrollToFeatures}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={scrollToDemo}
            >
              Demo
            </Button>
            <Button 
              variant="outline"
              onClick={handleDemoLogin}
              leftIcon={<Code className="w-4 h-4" />}
            >
              {isDemoLoading ? "Loading..." : "Sign In"}
            </Button>
            <Button 
              variant="primary"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroGeometric 
        title1="Learn Through"
        title2="Your Passions"
        onGetStarted={handleGetStarted}
      />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToDemo}
          className="animate-bounce hover:animate-none"
          aria-label="Scroll to demo"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      {/* Spool Demo Animation Section */}
      <section id="demo-section" className="py-24 px-6 bg-gradient-to-r from-teal-50/30 to-purple-50/20 dark:from-teal-900/10 dark:to-purple-900/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="primary" className="mb-4">
              ✨ See Our Vision
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-obsidian dark:text-gray-100">
              Watch <span className="text-gradient bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">Spool</span> in Action
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              See how we transform traditional linear education into connected, meaningful learning experiences
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white to-teal-50/50 dark:from-gray-800 dark:to-teal-900/20 rounded-2xl p-12 shadow-xl">
              <div className="text-center space-y-8">
                <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                  Coming Soon
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-4xl mx-auto text-lg leading-relaxed">
                  Traditional education treats learning as a straight line from start to finish. 
                  But real life is messy and interconnected. Spool organizes this complexity 
                  into clear, personalized academic lessons that connect to what matters most to each student.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <Badge variant="teal">🎯 Personalized</Badge>
                  <Badge variant="success">🔗 Connected</Badge>
                  <Badge variant="primary">✨ Engaging</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-obsidian dark:text-gray-100">
              Why Students Love <span className="text-gradient bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">Spool</span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Experience learning like never before with our revolutionary approach to education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-teal-50/50 dark:from-gray-800 dark:to-teal-900/20" hover>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-obsidian dark:text-gray-100">Personalized Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI adapts every lesson to your interests, learning style, and pace. No more one-size-fits-all education.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20" hover>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-obsidian dark:text-gray-100">Real-World Connections</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See how physics applies to your guitar, how math powers your favorite games, and how history shapes your world.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-pink-50/50 dark:from-gray-800 dark:to-pink-900/20" hover>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-obsidian dark:text-gray-100">Instant Engagement</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  From day one, learning feels exciting and relevant. Watch your motivation soar as subjects come alive.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about-section" className="py-24 px-6 bg-gradient-to-r from-teal-50/50 to-purple-50/30 dark:from-teal-900/10 dark:to-purple-900/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-obsidian dark:text-gray-100 mb-4">
              Trusted by Students Everywhere
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Join the learning revolution
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-teal-500">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Student Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-teal-500">5+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-teal-500">7+</div>
              <div className="text-gray-600 dark:text-gray-400">Subject Areas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-teal-500">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-obsidian dark:text-gray-100">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of students who've discovered the joy of learning through their passions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              variant="primary"
              size="lg" 
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="!rounded-lg"
              style={{ borderRadius: '0.5rem' }}
            >
              Start Your Journey
            </Button>
            
            <Link to="/login">
              <Button 
                variant="outline" 
                size="lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/spool-logo.png" 
                alt="Spool Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold">Spool</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Spool. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};