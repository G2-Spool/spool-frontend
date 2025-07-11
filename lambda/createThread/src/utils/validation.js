exports.validateCreateLearningPathRequest = (body) => {
  const errors = [];

  // Required fields based on learning_paths table
  if (!body.subject || typeof body.subject !== 'string' || body.subject.trim().length === 0) {
    errors.push('Subject is required and must be a non-empty string');
  }

  // Subject validation
  const validSubjects = ['Math', 'Science', 'Literature', 'Humanities'];
  if (body.subject && !validSubjects.includes(body.subject)) {
    errors.push(`Subject must be one of: ${validSubjects.join(', ')}`);
  }

  // Optional fields validation
  if (body.textbookId && typeof body.textbookId !== 'string') {
    errors.push('Textbook ID must be a string (UUID)');
  }

  if (body.currentTopicId && typeof body.currentTopicId !== 'string') {
    errors.push('Current topic ID must be a string');
  }

  if (body.currentSectionId && typeof body.currentSectionId !== 'string') {
    errors.push('Current section ID must be a string');
  }

  if (body.currentConceptId && typeof body.currentConceptId !== 'string') {
    errors.push('Current concept ID must be a string');
  }

  if (body.availableConcepts && !Array.isArray(body.availableConcepts)) {
    errors.push('Available concepts must be an array');
  }

  if (body.conceptsTotal && (typeof body.conceptsTotal !== 'number' || body.conceptsTotal < 0)) {
    errors.push('Concepts total must be a positive number');
  }

  if (body.dailyTargetMinutes && (typeof body.dailyTargetMinutes !== 'number' || body.dailyTargetMinutes < 1)) {
    errors.push('Daily target minutes must be a positive number');
  }

  if (body.estimatedCompletionDate) {
    const date = new Date(body.estimatedCompletionDate);
    if (isNaN(date.getTime())) {
      errors.push('Estimated completion date must be a valid date');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

exports.validateUpdateLearningPathRequest = (body) => {
  const errors = [];
  const allowedFields = [
    'currentTopicId', 'currentSectionId', 'currentConceptId',
    'nextConceptId', 'availableConcepts', 'conceptsCompleted',
    'conceptsTotal', 'conceptsMastered', 'averageMasteryScore',
    'estimatedCompletionDate', 'dailyTargetMinutes', 'status'
  ];
  
  // Check for at least one field to update
  const hasValidField = Object.keys(body).some(key => allowedFields.includes(key));
  if (!hasValidField) {
    errors.push('At least one valid field must be provided for update');
  }

  // Validate individual fields if present
  if ('status' in body) {
    const validStatuses = ['active', 'paused', 'completed', 'abandoned'];
    if (!validStatuses.includes(body.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if ('conceptsCompleted' in body && (typeof body.conceptsCompleted !== 'number' || body.conceptsCompleted < 0)) {
    errors.push('Concepts completed must be a non-negative number');
  }

  if ('conceptsTotal' in body && (typeof body.conceptsTotal !== 'number' || body.conceptsTotal < 0)) {
    errors.push('Concepts total must be a non-negative number');
  }

  if ('conceptsMastered' in body && (typeof body.conceptsMastered !== 'number' || body.conceptsMastered < 0)) {
    errors.push('Concepts mastered must be a non-negative number');
  }

  if ('averageMasteryScore' in body) {
    const score = body.averageMasteryScore;
    if (typeof score !== 'number' || score < 0 || score > 1) {
      errors.push('Average mastery score must be a number between 0 and 1');
    }
  }

  if ('dailyTargetMinutes' in body && (typeof body.dailyTargetMinutes !== 'number' || body.dailyTargetMinutes < 1)) {
    errors.push('Daily target minutes must be a positive number');
  }

  if ('availableConcepts' in body && !Array.isArray(body.availableConcepts)) {
    errors.push('Available concepts must be an array');
  }

  if ('estimatedCompletionDate' in body) {
    const date = new Date(body.estimatedCompletionDate);
    if (isNaN(date.getTime())) {
      errors.push('Estimated completion date must be a valid date');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};