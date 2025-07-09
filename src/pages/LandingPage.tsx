import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { BookOpen, Sparkles, Users, BarChart3, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-obsidian mb-6">
              Learning That <span className="text-gradient">Adapts to You</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Spool transforms textbook content into personalized educational journeys. 
              Through AI-powered voice interviews, we discover what excites each student 
              and make every lesson personally relevant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-teal-50 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-teal-100 rounded-full opacity-30 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-obsidian mb-4">
              Education Reimagined
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Every student is unique. Their education should be too.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Voice Interview
              </h3>
              <p className="text-gray-600">
                Natural conversation discovers student interests and learning style in just 5-7 minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-personal/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-personal" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                4 Life Categories
              </h3>
              <p className="text-gray-600">
                Content connects to personal, social, career, and philanthropic aspects of life.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-social/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-social" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Articulation-Based
              </h3>
              <p className="text-gray-600">
                Students explain their thinking process, ensuring true understanding.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-career/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-career" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Detailed analytics and gamification keep students motivated and parents informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-obsidian mb-4">
              How Spool Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              From voice interview to mastery in four simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Voice Interview
                  </h3>
                  <p className="text-gray-600">
                    Students have a natural conversation with our AI about their interests, 
                    hobbies, and aspirations. No forms, just friendly chat.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Personalized Content
                  </h3>
                  <p className="text-gray-600">
                    Every concept is presented with hooks, examples, and exercises that 
                    connect to the student's specific interests and life goals.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Articulated Understanding
                  </h3>
                  <p className="text-gray-600">
                    Students explain their thought process, not just provide answers. 
                    AI evaluates each step and provides targeted help where needed.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    True Mastery
                  </h3>
                  <p className="text-gray-600">
                    Two-stage exercises ensure both understanding and application ability. 
                    Progress tracking and gamification keep motivation high.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-teal-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-obsidian mb-4">
            Ready to Transform Learning?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of students discovering the joy of personalized education.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-8 w-8 text-teal-400" />
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