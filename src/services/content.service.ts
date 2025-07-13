import { API_ENDPOINTS } from '../config/api'
import api from './api'
import { 
  SpoolTopic, 
  SpoolSection, 
  SpoolConcept, 
  LearningModule, 
  PersonalizedContent, 
  PersonalizedContentRequest 
} from '../types/backend.types'


// ===== TOPIC OPERATIONS =====
export async function getTopics(): Promise<SpoolTopic[]> {
  try {
    const response = await api.get<SpoolTopic[]>(API_ENDPOINTS.contentAssembly);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    return [];
  }
}

export async function getTopicById(topicId: string): Promise<SpoolTopic | null> {
  try {
    const response = await api.get<SpoolTopic>(`${API_ENDPOINTS.contentAssembly}/${topicId}`);
    return response || null;
  } catch (error) {
    console.error(`Failed to fetch topic ${topicId}:`, error);
    return null;
  }
}

// ===== SECTION OPERATIONS =====
export async function getSections(topicId?: string): Promise<SpoolSection[]> {
  try {
    const url = topicId ? `${API_ENDPOINTS.contentAssembly}/sections?topic_id=${topicId}` : `${API_ENDPOINTS.contentAssembly}/sections`;
    const response = await api.get<SpoolSection[]>(url);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    return [];
  }
}

export async function getSectionById(sectionId: string): Promise<SpoolSection | null> {
  try {
    const response = await api.get<SpoolSection>(`${API_ENDPOINTS.contentAssembly}/sections/${sectionId}`);
    return response || null;
  } catch (error) {
    console.error(`Failed to fetch section ${sectionId}:`, error);
    return null;
  }
}

// ===== CONCEPT OPERATIONS =====
export async function getConcepts(sectionId?: string): Promise<SpoolConcept[]> {
  try {
    const url = sectionId ? `${API_ENDPOINTS.contentAssembly}/concepts?section_id=${sectionId}` : `${API_ENDPOINTS.contentAssembly}/concepts`;
    const response = await api.get<SpoolConcept[]>(url);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch concepts:', error);
    return [];
  }
}

export async function getConceptById(conceptId: string): Promise<SpoolConcept | null> {
  try {
    const response = await api.get<SpoolConcept>(`${API_ENDPOINTS.contentAssembly}/concepts/${conceptId}`);
    return response || null;
  } catch (error) {
    console.error(`Failed to fetch concept ${conceptId}:`, error);
    return null;
  }
}

// ===== PERSONALIZED CONTENT =====
export async function getPersonalizedContent(request: PersonalizedContentRequest): Promise<PersonalizedContent | null> {
  try {
    const response = await api.post<PersonalizedContent>(API_ENDPOINTS.contentAssembly, request);
    return response || null;
  } catch (error) {
    console.error('Failed to get personalized content:', error);
    return null;
  }
}

// ===== LEARNING MODULES =====
export async function getLearningModules(conceptId: string): Promise<LearningModule[]> {
  try {
    const response = await api.get<LearningModule[]>(`${API_ENDPOINTS.contentAssembly}/concepts/${conceptId}/modules`);
    return response || [];
  } catch (error) {
    console.error(`Failed to fetch learning modules for concept ${conceptId}:`, error);
    return [];
  }
}