import type { Thread } from '../types/thread.types';

// Example thread with comprehensive educational content
export const EXAMPLE_THREAD_002: Thread = {
  threadId: 'blackjack-probability-guide',
  userId: 'example',
  userInput: 'What are the probabilities of winning at blackjack?',
  analysis: {
    subjects: ['Mathematics', 'Statistics', 'Probability Theory'],
    topics: ['Probability Theory', 'Statistical Analysis', 'Risk Management'],
    concepts: ['Probabilities', 'Expected Value', 'Risk Reward', 'Confidence intervals'],
    summary: 'A comprehensive analysis of blackjack probabilities, covering basic strategy, house edge calculations, card counting fundamentals, and optimal play strategies to maximize winning potential.'
  },
  sections: [
    {
      id: 'section-1',
      title: 'Basic Probability Theory',
      text: `Understanding blackjack probabilities starts with fundamental probability concepts:

Key principles include:
- Sample space: All possible outcomes in blackjack
- Event probability: Likelihood of specific card combinations
- Conditional probability: How previous cards affect future outcomes
- Independence: Why each hand is statistically independent
- Expected value: The average outcome over many hands

These concepts form the foundation for all blackjack analysis.`,
      relevanceScore: 0.95,
      difficulty: 'beginner',
      estimatedMinutes: 18,
      conceptIds: ['probability-basics', 'sample-space']
    },
    {
      id: 'section-2',
      title: 'Expected Value in Decision Making',
      text: `Expected value is a fundamental concept for evaluating outcomes under uncertainty:

**Core principles**:
- **Mathematical expectation**: The average outcome of a random event over many trials
- **Calculation**: Multiply each possible outcome by its probability and sum the results
- **Decision framework**: Choose options with the highest expected value
- **Risk assessment**: Understand the difference between expected and actual outcomes

**Applications beyond gaming**:
- Investment decisions and portfolio theory
- Insurance pricing and risk management
- Business strategy and product development
- Medical treatment effectiveness analysis

Understanding expected value helps make rational decisions in any uncertain situation.`,
      relevanceScore: 0.88,
      difficulty: 'intermediate',
      estimatedMinutes: 22,
      conceptIds: ['expected-value', 'decision-theory', 'risk-assessment']
    },
    {
      id: 'section-3',
      title: 'Risk Assessment in Probability',
      text: `Risk assessment involves evaluating potential outcomes and their likelihood:

**Core principles**:
- **Risk identification**: Recognizing potential negative outcomes
- **Probability estimation**: Calculating likelihood of adverse events
- **Impact assessment**: Measuring potential consequences
- **Risk tolerance**: Understanding acceptable levels of uncertainty

**Risk metrics**:
- **Variance**: Measure of outcome variability
- **Standard deviation**: Square root of variance, same units as original data
- **Value at Risk (VaR)**: Maximum expected loss over a time period
- **Probability of ruin**: Chance of losing everything

**Applications**:
- Financial portfolio management
- Insurance underwriting
- Project planning and management
- Safety and reliability engineering

Effective risk assessment helps make informed decisions under uncertainty.`,
      relevanceScore: 0.89,
      difficulty: 'intermediate',
      estimatedMinutes: 12,
      conceptIds: ['risk-assessment', 'variance', 'value-at-risk']
    },
    {
      id: 'section-4',
      title: 'Confidence Intervals and Statistical Precision',
      text: `Confidence intervals quantify uncertainty in statistical estimates:

**Key concepts**:
- **Confidence intervals**: Range of values likely to contain the true parameter
- **Margin of error**: How much uncertainty exists in our estimates
- **Statistical significance**: Whether observed differences are meaningful
- **Sample size effects**: How more data improves confidence in results

**Interpretation guidelines**:
- 95% confidence interval means we're 95% certain the true value lies within the range
- Wider intervals indicate more uncertainty
- Larger samples generally produce narrower, more precise intervals
- Confidence level vs. confidence interval are different concepts

**Real-world applications**:
- Clinical trial results and medical research
- Opinion polling and survey analysis
- Quality control in manufacturing
- A/B testing and experimental design

Understanding confidence intervals helps evaluate the reliability of any probability-based conclusion.`,
      relevanceScore: 0.93,
      difficulty: 'advanced',
      estimatedMinutes: 14,
      conceptIds: ['confidence-intervals', 'statistical-significance', 'margin-of-error']
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active'
};

// Helper function to check if a thread ID is an example thread
export const isExampleThread = (threadId: string): boolean => {
  return threadId.startsWith('example-thread-');
}; 