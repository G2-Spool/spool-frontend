import type { Thread } from '../types/thread.types';

// Example thread with comprehensive educational content
export const EXAMPLE_THREAD: Thread = {
  threadId: 'example-thread-001',
  userId: 'example',
  userInput: 'How do neural networks learn from data and make predictions?',
  analysis: {
    subjects: ['Computer Science', 'Machine Learning'],
    topics: ['Neural Networks', 'Deep Learning', 'Backpropagation'],
    concepts: ['Gradient Descent', 'Activation Functions', 'Weight Optimization', 'Loss Functions'],
    summary: 'An introduction to neural network learning mechanisms, covering how artificial neural networks process data, adjust weights through backpropagation, and make predictions using learned patterns.'
  },
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to Neural Networks',
      text: `Neural networks are computational models inspired by the human brain. They consist of interconnected nodes (neurons) organized in layers that process information through weighted connections.

Key components include:
- Input layer: Receives raw data
- Hidden layers: Process and transform data
- Output layer: Produces predictions
- Weights: Adjustable parameters that determine connection strength
- Biases: Additional parameters that shift activation`,
      relevanceScore: 95,
      difficulty: 'beginner',
      estimatedMinutes: 5,
      conceptIds: ['nn-basics', 'architecture']
    },
    {
      id: 'section-2',
      title: 'How Neural Networks Learn',
      text: `Neural networks learn through a process called training, which involves:

1. **Forward Propagation**: Input data flows through the network, producing predictions
2. **Loss Calculation**: Compare predictions to actual values using a loss function
3. **Backpropagation**: Calculate gradients of the loss with respect to weights
4. **Weight Updates**: Adjust weights to minimize loss using optimization algorithms

This iterative process continues until the network achieves satisfactory performance.`,
      relevanceScore: 90,
      difficulty: 'intermediate',
      estimatedMinutes: 7,
      conceptIds: ['training', 'backprop', 'optimization']
    },
    {
      id: 'section-3',
      title: 'Gradient Descent and Optimization',
      text: `Gradient descent is the optimization algorithm that enables learning:

**Basic Gradient Descent**:
- Calculate the gradient (slope) of the loss function
- Move weights in the opposite direction of the gradient
- Learning rate controls step size

**Variants**:
- Stochastic Gradient Descent (SGD): Updates using single examples
- Mini-batch GD: Updates using small batches
- Adam: Adaptive learning rates for each parameter

The choice of optimizer significantly impacts training speed and final performance.`,
      relevanceScore: 85,
      difficulty: 'intermediate',
      estimatedMinutes: 6,
      conceptIds: ['gradient-descent', 'optimization', 'learning-rate']
    },
    {
      id: 'section-4',
      title: 'Making Predictions',
      text: `Once trained, neural networks make predictions through forward propagation:

1. **Input Processing**: Raw data is normalized and fed to the input layer
2. **Layer Computation**: Each layer applies weights, biases, and activation functions
3. **Output Generation**: The final layer produces predictions

**Types of Predictions**:
- Classification: Assigns inputs to discrete categories
- Regression: Predicts continuous values
- Generation: Creates new data (e.g., text, images)

The network's learned weights encode patterns from training data, enabling generalization to new examples.`,
      relevanceScore: 80,
      difficulty: 'beginner',
      estimatedMinutes: 4,
      conceptIds: ['inference', 'prediction', 'generalization']
    },
    {
      id: 'section-5',
      title: 'Practical Applications and Examples',
      text: `Neural networks power many modern AI applications:

**Computer Vision**:
- Image classification (identifying objects)
- Object detection (locating objects in images)
- Facial recognition

**Natural Language Processing**:
- Language translation
- Sentiment analysis
- Chatbots and virtual assistants

**Other Applications**:
- Game playing (Chess, Go)
- Autonomous vehicles
- Medical diagnosis
- Financial predictions

Each application uses specialized architectures tailored to the problem domain.`,
      relevanceScore: 75,
      difficulty: 'beginner',
      estimatedMinutes: 5,
      conceptIds: ['applications', 'real-world', 'use-cases']
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active'
};

