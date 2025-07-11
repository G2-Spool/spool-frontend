exports.extractUserFromEvent = (event) => {
  // Check for Cognito authorizer context
  if (event.requestContext?.authorizer?.claims) {
    return event.requestContext.authorizer.claims;
  }

  // Check for Lambda authorizer context
  if (event.requestContext?.authorizer?.user) {
    return event.requestContext.authorizer.user;
  }

  // Check for direct JWT claims (API Gateway v2)
  if (event.requestContext?.authorizer?.jwt?.claims) {
    return event.requestContext.authorizer.jwt.claims;
  }

  // For local testing or development
  if (event.headers?.['x-test-user']) {
    try {
      return JSON.parse(event.headers['x-test-user']);
    } catch (e) {
      console.error('Failed to parse test user header:', e);
    }
  }

  return null;
};

exports.hasRequiredPermissions = (user, requiredPermissions = []) => {
  if (!user) return false;
  
  // Check if user has admin role
  if (user['cognito:groups'] && user['cognito:groups'].includes('admins')) {
    return true;
  }

  // Check specific permissions
  if (requiredPermissions.length === 0) {
    return true; // No specific permissions required
  }

  const userPermissions = user.permissions || [];
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

// Get student profile ID from user ID
// In a real implementation, this would query the student_profiles table
exports.getStudentProfileId = async (userId) => {
  // For now, we'll assume the student profile ID is the same as the user ID
  // In production, this would query: SELECT id FROM student_profiles WHERE user_id = $1
  return userId;
};