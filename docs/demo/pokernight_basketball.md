import React, { useState } from 'react';
import { ChevronRight, Sparkles, Activity, Target, X, CheckCircle, AlertCircle, BookOpen, Lightbulb, Brain, TrendingUp } from 'lucide-react';

const SpoolBlackjackThreadDemo = () => {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [showExercise, setShowExercise] = useState(false);
  const [exerciseNumber, setExerciseNumber] = useState(1);

  // Hard-coded user data
  const user = {
    name: "Alex",
    interests: ["Basketball", "Gaming", "Music"],
    primaryInterest: "Basketball"
  };

  // Thread data
  const thread = {
    title: "Making Smart Decisions at Poker Night",
    situation: "You've been invited to a blackjack poker night at your friend's house",
    concepts: [
      {
        id: "probability",
        name: "Probability",
        description: "Understanding the likelihood of events occurring",
        relevanceScore: 0.95,
        subject: "Statistics",
        icon: ":game_die:"
      },
      {
        id: "expected-value",
        name: "Expected Value",
        description: "Calculating the average outcome of decisions",
        relevanceScore: 0.92,
        subject: "Statistics",
        icon: ":moneybag:"
      },
      {
        id: "risk-reward",
        name: "Risk vs Reward",
        description: "Balancing potential gains against potential losses",
        relevanceScore: 0.88,
        subject: "Economics",
        icon: ":scales:"
      },
      {
        id: "confidence-intervals",
        name: "Confidence Intervals",
        description: "Understanding the range of likely outcomes",
        relevanceScore: 0.85,
        subject: "Statistics",
        icon: ":bar_chart:"
      }
    ]
  };

  // Concept details for Probability
  const probabilityDetail = {
    hook: {
      title: "Why Probability Matters at Poker Night",
      content: "At your friend's blackjack table, every decision you make - whether to hit, stand, or double down - depends on probability. Understanding the likelihood of drawing certain cards can be the difference between walking away with bragging rights or empty pockets. Just like in basketball, where you calculate the odds of making different shots, blackjack is all about making decisions based on mathematical probabilities."
    },
    example: {
      title: "Basketball Connection: The Clutch Shot Decision",
      content: "Imagine you're the coach with 10 seconds left in the game, down by 2 points. You have two options: Have your star player (who shoots 45% from 3-point range) take a three-pointer to win, or run a play for your center (who shoots 65% from close range) to tie and go to overtime. This is exactly like deciding whether to hit on 16 when the dealer shows a 7 in blackjack - you need to calculate which option gives you the better probability of success.",
      visual: ":basketball: 45% chance to win outright vs 65% chance to tie → Similar to :black_joker: 38% chance to improve your hand vs 62% chance to bust"
    },
    approach: {
      title: "Academic Approach: Decision Tree Analysis",
      steps: [
        "Identify all possible outcomes",
        "Calculate the probability of each outcome",
        "Determine the value/consequence of each outcome",
        "Multiply probability × value for each path",
        "Choose the path with the highest expected outcome"
      ],
      formula: "Optimal Decision = MAX(Σ(Probability × Outcome Value))"
    },
    nonExample: {
      title: "When Intuition Fails: The Hero Ball Mistake",
      scenario: "Your team is down by 3 with 5 seconds left. Your worst 3-point shooter (15% success rate) decides to be the hero and launches a deep three instead of passing to your best shooter (42% success rate) who's open in the corner.",
      explanation: "This is like hitting on 19 in blackjack because you 'feel lucky' - ignoring probability in favor of gut feeling almost always leads to poor outcomes. The math shows the open shooter has nearly 3x better odds, just like standing on 19 gives you much better odds than hitting."
    }
  };

  // Exercises
  const exercises = {
    1: {
      title: "Exercise 1: The Final Possession",
      context: "Basketball Probability Decision",
      scenario: "You're the point guard with 8 seconds left in the game. Your team is down by 1 point. As you bring the ball up court, you see three options developing:\n\n• Drive to the basket yourself (you make 55% of your layups, but there's a 30% chance of getting blocked)\n• Pass to your shooting guard for a mid-range jumper (he shoots 48% from mid-range)\n• Set up your power forward for a post move (he scores 62% of the time when isolated)\n\nUsing probability calculations, which option gives your team the best chance to win?",
      hint: "Remember to factor in all probabilities - for the drive, you need to calculate: Success = (Probability of not getting blocked) × (Probability of making the shot)"
    },
    2: {
      title: "Exercise 2: The Blackjack Dilemma",
      context: "Blackjack Probability Application",
      scenario: "You're playing blackjack and have been dealt a hand totaling 15 (a 7 and an 8). The dealer's face-up card is a 6. You need to decide whether to hit or stand.\n\nGiven information:\n• There are 4 remaining decks in play\n• Cards that would improve your hand without busting: Ace through 6\n• Probability of dealer busting with a 6 showing: 42%\n• Your current probability of winning if you stand: 42%\n\nCalculate the probability of improving your hand if you hit, then determine the mathematically optimal decision.",
      hint: "Count how many cards would help you (Ace=1, 2, 3, 4, 5, 6) versus how many would make you bust (7, 8, 9, 10, J, Q, K)"
    }
  };

  const ThreadView = () => (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Learning Thread</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{thread.title}</h1>
        <p className="text-gray-600">
          <span className="font-medium">Situation:</span> {thread.situation}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Personalized for {user.name} • Primary interest: {user.primaryInterest}
        </p>
      </div>

      {/* Thread Visualization */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Learning Path
        </h2>
        <div className="flex items-center gap-3 overflow-x-auto py-4">
          {thread.concepts.map((concept, index) => (
            <React.Fragment key={concept.id}>
              <button
                onClick={() => setSelectedConcept(concept.id)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  selectedConcept === concept.id
                    ? 'bg-white shadow-lg scale-105 border-2 border-blue-500'
                    : 'bg-white/80 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-2">{concept.icon}</div>
                <div className="text-sm font-medium text-gray-900">{concept.name}</div>
                <div className="text-xs text-gray-500 mt-1">{concept.subject}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${concept.relevanceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{Math.round(concept.relevanceScore * 100)}%</span>
                </div>
              </button>
              {index < thread.concepts.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Concept Details */}
      {selectedConcept === 'probability' && !showExercise && (
        <ConceptDetail 
          concept={thread.concepts[0]} 
          details={probabilityDetail}
          onStartExercise={() => setShowExercise(true)}
        />
      )}

      {/* Exercise View */}
      {showExercise && (
        <ExerciseView 
          exercise={exercises[exerciseNumber]}
          exerciseNumber={exerciseNumber}
          onNext={() => {
            if (exerciseNumber === 1) {
              setExerciseNumber(2);
            } else {
              setShowExercise(false);
              setExerciseNumber(1);
            }
          }}
          onBack={() => setShowExercise(false)}
        />
      )}

      {/* Placeholder for other concepts */}
      {selectedConcept && selectedConcept !== 'probability' && !showExercise && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-600">
            Concept details for "{thread.concepts.find(c => c.id === selectedConcept)?.name}" would appear here
          </p>
        </div>
      )}
    </div>
  );

  const ConceptDetail = ({ concept, details, onStartExercise }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{concept.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{concept.name}</h2>
              <p className="text-blue-100">{concept.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Hook Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{details.hook.title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{details.hook.content}</p>
          </section>

          {/* Example Section */}
          <section className="bg-blue-50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">{details.example.title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{details.example.content}</p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-mono text-center">{details.example.visual}</p>
            </div>
          </section>

          {/* Approach Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">{details.approach.title}</h3>
            </div>
            <ol className="space-y-2 mb-4">
              {details.approach.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm font-mono text-center">{details.approach.formula}</p>
            </div>
          </section>

          {/* Non-Example Section */}
          <section className="bg-red-50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <X className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">{details.nonExample.title}</h3>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-3">
              <p className="text-gray-700 italic">{details.nonExample.scenario}</p>
            </div>
            <p className="text-gray-700 text-sm">{details.nonExample.explanation}</p>
          </section>

          {/* Start Exercise Button */}
          <div className="pt-4">
            <button
              onClick={onStartExercise}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Start Practice Exercises
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ExerciseView = ({ exercise, exerciseNumber, onNext, onBack }) => {
    const [response, setResponse] = useState('');
    const [showHint, setShowHint] = useState(false);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{exercise.title}</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Exercise {exerciseNumber} of 2
            </span>
          </div>
          <p className="text-green-100 mt-2">{exercise.context}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <p className="text-gray-700 whitespace-pre-line">{exercise.scenario}</p>
          </div>

          {/* Hint Section */}
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              Need a hint?
            </button>
          )}
          
          {showHint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{exercise.hint}</p>
            </div>
          )}

          {/* Response Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Solution & Reasoning:
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Explain your thinking step by step..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Concept
            </button>
            <button
              onClick={onNext}
              disabled={!response.trim()}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                response.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {exerciseNumber === 1 ? (
                <>Next Exercise <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Complete <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return <ThreadView />;
};

export default SpoolBlackjackThreadDemo;