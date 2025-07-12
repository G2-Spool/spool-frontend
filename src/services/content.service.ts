import { MICROSERVICE_ENDPOINTS, apiCall, getAuthHeaders } from '../config/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { 
  SpoolTopic, 
  SpoolSection, 
  SpoolConcept, 
  LearningModule, 
  PersonalizedContent, 
  PersonalizedContentRequest,
  SpoolApiResponse,
  SpoolPaginatedResponse 
} from '../types/backend.types'

// Helper function to get authenticated headers
async function getAuthenticatedHeaders(): Promise<HeadersInit> {
  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()
    return getAuthHeaders(token)
  } catch (error) {
    console.error('Error getting auth headers:', error)
    return getAuthHeaders()
  }
}

// ===== TOPIC OPERATIONS =====
export async function getTopics(): Promise<SpoolTopic[]> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolPaginatedResponse<SpoolTopic>>(
    MICROSERVICE_ENDPOINTS.CONTENT.TOPICS,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error('Failed to fetch topics:', response.error)
  return []
}

export async function getTopicById(topicId: string): Promise<SpoolTopic | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<SpoolTopic>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.TOPIC_DETAILS}/${topicId}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error(`Failed to fetch topic ${topicId}:`, response.error)
  return null
}

export async function getTopicWithProgress(topicId: string, userId: string): Promise<SpoolTopic | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<SpoolTopic>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.TOPIC_DETAILS}/${topicId}?user_id=${userId}&include_progress=true`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error(`Failed to fetch topic with progress ${topicId}:`, response.error)
  return null
}

// ===== CONCEPT OPERATIONS =====
export async function getConcepts(sectionId?: string): Promise<SpoolConcept[]> {
  const headers = await getAuthenticatedHeaders()
  const url = sectionId 
    ? `${MICROSERVICE_ENDPOINTS.CONTENT.CONCEPTS}?section_id=${sectionId}`
    : MICROSERVICE_ENDPOINTS.CONTENT.CONCEPTS
  
  const response = await apiCall<SpoolPaginatedResponse<SpoolConcept>>(url, {
    method: 'GET',
    headers,
  })

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error('Failed to fetch concepts:', response.error)
  return []
}

export async function getConceptById(conceptId: string): Promise<SpoolConcept | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<SpoolConcept>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.CONCEPT_DETAILS}/${conceptId}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error(`Failed to fetch concept ${conceptId}:`, response.error)
  return null
}

export async function getConceptWithProgress(conceptId: string, userId: string): Promise<SpoolConcept | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<SpoolConcept>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.CONCEPT_DETAILS}/${conceptId}?user_id=${userId}&include_progress=true`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error(`Failed to fetch concept with progress ${conceptId}:`, response.error)
  return null
}

// ===== LEARNING MODULE OPERATIONS =====
export async function getLearningModules(conceptId: string): Promise<LearningModule[]> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolPaginatedResponse<LearningModule>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.MODULES}?concept_id=${conceptId}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error(`Failed to fetch learning modules for concept ${conceptId}:`, response.error)
  return []
}

// ===== PERSONALIZED CONTENT =====
export async function getPersonalizedContent(
  userId: string,
  request: PersonalizedContentRequest
): Promise<PersonalizedContent | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<PersonalizedContent>>(
    MICROSERVICE_ENDPOINTS.CONTENT.PERSONALIZED_CONTENT,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...request, user_id: userId }),
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error('Failed to fetch personalized content:', response.error)
  return null
}

export async function getRecommendations(userId: string): Promise<{
  topics: SpoolTopic[]
  concepts: SpoolConcept[]
} | null> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<{
    topics: SpoolTopic[]
    concepts: SpoolConcept[]
  }>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.RECOMMENDATIONS}?user_id=${userId}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error('Failed to fetch recommendations:', response.error)
  return null
}

// ===== LEARNING PATH OPERATIONS =====
export async function getLearningPath(userId: string): Promise<any[]> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<any[]>>(
    `${MICROSERVICE_ENDPOINTS.CONTENT.LEARNING_PATH}?user_id=${userId}`,
    {
      method: 'GET',
      headers,
    }
  )

  if (response.success && response.data?.data) {
    return response.data.data
  }

  console.error('Failed to fetch learning path:', response.error)
  return []
}

export async function updateLearningPath(
  userId: string,
  updates: any
): Promise<boolean> {
  const headers = await getAuthenticatedHeaders()
  
  const response = await apiCall<SpoolApiResponse<any>>(
    MICROSERVICE_ENDPOINTS.CONTENT.UPDATE_LEARNING_PATH,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ user_id: userId, ...updates }),
    }
  )

  if (response.success) {
    return true
  }

  console.error('Failed to update learning path:', response.error)
  return false
}

// ===== UTILITY FUNCTIONS =====
export function transformLegacyTopicData(legacyTopic: any): SpoolTopic {
  return {
    id: legacyTopic.id || 'unknown',
    title: legacyTopic.title || 'Untitled',
    description: legacyTopic.description || '',
    category: legacyTopic.category || 'general',
    difficulty_level: legacyTopic.difficulty_level || 'beginner',
    estimated_duration_hours: legacyTopic.estimated_duration_hours || 5,
    prerequisites: legacyTopic.prerequisites || [],
    learning_objectives: legacyTopic.learning_objectives || [],
    sections: legacyTopic.sections?.map(transformLegacySection) || [],
    created_at: legacyTopic.created_at || new Date().toISOString(),
    updated_at: legacyTopic.updated_at || new Date().toISOString(),
  }
}

export function transformLegacySection(legacySection: any): SpoolSection {
  return {
    id: legacySection.id || 'unknown',
    title: legacySection.title || 'Untitled',
    description: legacySection.description || '',
    order: legacySection.order || 0,
    concepts: legacySection.concepts?.map(transformLegacyConcept) || [],
    estimated_duration_minutes: legacySection.estimated_duration_minutes || 30,
  }
}

export function transformLegacyConcept(legacyConcept: any): SpoolConcept {
  return {
    id: legacyConcept.id || 'unknown',
    title: legacyConcept.title || 'Untitled',
    description: legacyConcept.description || '',
    section_id: legacyConcept.section_id || '',
    order: legacyConcept.order || 0,
    learning_modules: [],
    exercises: [],
    estimated_duration_minutes: legacyConcept.estimated_duration_minutes || 15,
    difficulty_level: legacyConcept.difficulty_level || 'beginner',
    prerequisites: legacyConcept.prerequisites || [],
  }
} 