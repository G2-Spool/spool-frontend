# Spool - Functional Requirements Document (FRD)

**Version:** 1.0  
**Date:** January 2024  
**Author:** Systems Analysis Team

## 1. Introduction

This Functional Requirements Document (FRD) translates the high-level business needs from the Spool Product Vision Document into detailed, specific system behaviors. This document serves as the primary instruction manual for the development and quality assurance teams, defining exactly how the Spool personalized learning management system must function. Every functional requirement herein is traceable back to the core business requirement of delivering personalized, engaging education that adapts to individual student interests while ensuring mastery through articulated understanding.

## 2. Functional Requirements

### 2.1 Voice Interview System

**User Story:** As a new student, I want to have a natural conversation about my interests, so that the system can personalize my entire learning experience.

| ID | Requirement Description |
| :---- | :---- |
| FR-001 | The system **shall** establish a WebRTC connection within 3 seconds when the student clicks "Start Interview". |
| FR-002 | The system **shall** request microphone permissions and display clear instructions if permissions are denied. |
| FR-003 | The system **shall** stream audio at 16kHz sample rate to the Python backend for processing. |
| FR-004 | The system **shall** display a real-time transcript of both AI agent questions and student responses in a chat interface. |
| FR-005 | The system **shall** use blue bubbles for AI responses and green bubbles for student responses in the chat display. |
| FR-006 | The system **shall** conduct a 5-7 minute adaptive conversation covering interests, activities, and aspirations. |
| FR-007 | The system **shall** extract and categorize interests into four life categories: personal, social, career, and philanthropic. |
| FR-008 | The system **shall** provide a "Pause" button that temporarily stops the interview and maintains session state. |
| FR-009 | The system **shall** offer a text input fallback if voice recognition fails after 3 attempts. |
| FR-010 | The system **shall** generate a comprehensive interest profile upon interview completion with at least 5 distinct interests. |

### 2.2 Student Profile Management

**User Story:** As a student, I want my interests and preferences saved and used throughout my learning journey, so that every lesson feels personally relevant.

| ID | Requirement Description |
| :---- | :---- |
| FR-011 | The system **shall** create a student profile containing first name, last name, and optional birthday. |
| FR-012 | The system **shall** store extracted interests as a JSON array with categories and strength indicators. |
| FR-013 | The system **shall** maintain career interests and philanthropic interests as separate arrays in the profile. |
| FR-014 | The system **shall** allow students to review and modify their interest profile after initial creation. |
| FR-015 | The system **shall** track learning style indicators based on interaction patterns and store them in the profile. |
| FR-016 | The system **shall** associate each student profile with a parent organization if applicable. |

### 2.3 Content Transformation Engine

**User Story:** As a student, I want educational content presented in ways that connect to my interests, so that I stay engaged and understand concepts better.

| ID | Requirement Description |
| :---- | :---- |
| FR-017 | The system **shall** process uploaded textbook PDFs and extract structured content by chapter, section, and concept. |
| FR-018 | The system **shall** generate vector embeddings for each content chunk using a 1536-dimensional model. |
| FR-019 | The system **shall** store content vectors in Pinecone with metadata including book, chapter, section, and concept IDs. |
| FR-020 | The system **shall** build a hierarchical knowledge graph in Neo4j representing Subject→Topic→Section→Concept relationships. |
| FR-021 | The system **shall** tag each concept with required prerequisites and related concepts in the knowledge graph. |
| FR-022 | The system **shall** classify content chunks by type: explanation, example, formula, exercise, or definition. |

### 2.4 Concept Display System

**User Story:** As a student, I want each new concept introduced through multiple perspectives that relate to my life, so that I immediately understand why it matters.

| ID | Requirement Description |
| :---- | :---- |
| FR-023 | The system **shall** display a 2x2 grid of "Hook & Relevance" cards as the first component of each concept. |
| FR-024 | The system **shall** dynamically select the career hook based on the student's primary career interest. |
| FR-025 | The system **shall** dynamically select the philanthropic hook based on the student's primary cause interest. |
| FR-026 | The system **shall** display 3-4 "Show Me" examples selected based on the student's top interests. |
| FR-027 | The system **shall** ensure example diversity across difficulty levels (basic, intermediate, advanced). |
| FR-028 | The system **shall** present the "What & How" component with four sections: Vocabulary, Mental Model, Principles, and Workflow. |
| FR-029 | The system **shall** provide interactive elements in the Mental Model section when applicable. |
| FR-030 | The system **shall** track time spent on each component for analytics purposes. |

### 2.5 Exercise Generation System

**User Story:** As a student, I want practice problems that use scenarios from my interests, so that I can learn through familiar contexts.

| ID | Requirement Description |
| :---- | :---- |
| FR-031 | The system **shall** generate an initial exercise for each concept using the student's interests and one life category. |
| FR-032 | The system **shall** prompt students to explain their complete thought process, not just provide an answer. |
| FR-033 | The system **shall** analyze student explanations to identify articulated logical steps. |
| FR-034 | The system **shall** compare identified steps against the expected solution pathway for the concept. |
| FR-035 | The system **shall** create a competency map showing correctly explained, missing, and incorrect steps. |
| FR-036 | The system **shall** generate targeted remediation for the FIRST incorrectly explained step when gaps are identified. |
| FR-037 | The system **shall** require successful completion of remediation before allowing return to the original exercise. |
| FR-038 | The system **shall** generate an advanced exercise with additional complexity upon initial exercise completion. |
| FR-039 | The system **shall** mark a concept as mastered only after both initial and advanced exercises are completed successfully. |
| FR-040 | The system **shall** store all exercise attempts and evaluations for progress tracking. |

### 2.6 Progress Tracking & Gamification

**User Story:** As a student, I want to see my learning progress and earn rewards, so that I stay motivated to continue learning.

| ID | Requirement Description |
| :---- | :---- |
| FR-041 | The system **shall** track concepts completed, time spent, and mastery status for each learning path. |
| FR-042 | The system **shall** award points for concept completion: 10 points for initial exercise, 15 points for advanced exercise. |
| FR-043 | The system **shall** track daily learning streaks and display current and longest streak counts. |
| FR-044 | The system **shall** award badges based on defined criteria (streak length, concepts mastered, subject completion). |
| FR-045 | The system **shall** display a visual learning path showing completed, current, and upcoming concepts. |
| FR-046 | The system **shall** calculate and display completion percentage for each subject and overall progress. |
| FR-047 | The system **shall** generate detailed competency reports showing mastered concepts with timestamps. |

### 2.7 Parent/Educator Dashboard

**User Story:** As a parent or educator, I want to monitor student progress and see evidence of learning, so that I can support their educational journey.

| ID | Requirement Description |
| :---- | :---- |
| FR-048 | The system **shall** provide a dashboard showing all associated students and their current progress. |
| FR-049 | The system **shall** display time spent learning, concepts mastered, and current streak for each student. |
| FR-050 | The system **shall** show detailed concept mastery evidence including exercise responses and evaluations. |
| FR-051 | The system **shall** generate weekly progress reports summarizing learning activities and achievements. |
| FR-052 | The system **shall** allow parents to view the student's interest profile and personalization settings. |
| FR-053 | The system **shall** provide alerts for significant milestones or extended periods of inactivity. |

### 2.8 Multi-Subject Learning Paths

**User Story:** As a student, I want to study multiple subjects with consistent personalization, so that all my learning feels cohesive.

| ID | Requirement Description |
| :---- | :---- |
| FR-054 | The system **shall** allow students to have active learning paths in multiple subjects simultaneously. |
| FR-055 | The system **shall** maintain separate progress tracking for each subject learning path. |
| FR-056 | The system **shall** apply the same interest profile across all subject personalizations. |
| FR-057 | The system **shall** enforce prerequisite requirements within and across subjects where defined. |
| FR-058 | The system **shall** suggest next concepts based on prerequisites and student readiness. |

### 2.9 Microschool Management

**User Story:** As a microschool administrator, I want to manage multiple students and track overall progress, so that I can effectively support all learners.

| ID | Requirement Description |
| :---- | :---- |
| FR-059 | The system **shall** allow administrators to create and manage up to 20 student accounts per organization. |
| FR-060 | The system **shall** provide bulk operations for student account creation and management. |
| FR-061 | The system **shall** generate aggregate analytics across all students in the organization. |
| FR-062 | The system **shall** allow administrators to assign specific textbooks to students. |
| FR-063 | The system **shall** provide role-based access control with admin, educator, and student roles. |

## 3. Data Handling and Validation

### 3.1 Input Validation

**Voice Interview Inputs:**
- Audio stream **must** be 16kHz mono PCM format
- Interview responses **must** be between 2 seconds and 2 minutes per answer
- Text fallback inputs **must** be between 10 and 500 characters

**Profile Data:**
- First name and last name **must** contain only letters, spaces, hyphens, and apostrophes
- Birthday **must** be a valid date between 100 years ago and today
- Interest arrays **must** contain at least 1 and no more than 20 items

**Exercise Responses:**
- Thought process explanations **must** be between 50 and 2000 characters
- Response time **must** not exceed 30 minutes per exercise
- All responses **must** be stored with timestamps and session IDs

### 3.2 Data Processing

**Interest Extraction:**
- The system **shall** process interview transcripts using NLP to identify interest keywords and themes
- The system **shall** assign confidence scores (0.0-1.0) to each extracted interest
- The system **shall** map interests to predefined categories with at least 70% confidence

**Content Personalization:**
- The system **shall** match student interests to content tags using semantic similarity
- The system **shall** select content with the highest relevance scores for display
- The system **shall** maintain a minimum diversity threshold of 30% across examples

**Progress Calculations:**
- The system **shall** calculate mastery as: (completed_concepts / total_concepts) * 100
- The system **shall** update streak counts at midnight in the student's timezone
- The system **shall** calculate time spent excluding idle periods over 5 minutes

### 3.3 Output Formatting

**Progress Display:**
- Percentages **must** be displayed with no decimal places (e.g., "75%")
- Time **must** be displayed as "X hours Y minutes" for durations over 1 hour
- Dates **must** be displayed in the format "Month DD, YYYY"

**Competency Reports:**
- Reports **must** include concept name, mastery date, and time spent
- Exercise evaluations **must** show all identified steps with pass/fail status
- Badges **must** display with name, icon, and earned date

## 4. Error Handling and Messaging

### 4.1 Connection Errors

| Condition | System Action | User Message |
| :---- | :---- | :---- |
| WebRTC connection fails | Retry 3 times with exponential backoff | "Having trouble connecting. Please check your internet connection and try again." |
| Microphone permission denied | Display setup instructions | "Microphone access is required for the interview. Please enable microphone permissions in your browser settings." |
| Audio stream interrupted | Attempt reconnection | "Audio connection lost. Reconnecting..." |

### 4.2 Data Validation Errors

| Condition | System Action | User Message |
| :---- | :---- | :---- |
| Invalid exercise response (<50 chars) | Prevent submission | "Please provide a more detailed explanation of your thought process (minimum 50 characters)." |
| Missing required profile field | Highlight field | "Please complete all required fields marked with *" |
| Interest profile incomplete | Return to interview | "We need to learn more about your interests. Let's continue our conversation." |

### 4.3 System Errors

| Condition | System Action | User Message |
| :---- | :---- | :---- |
| LLM API timeout | Use cached response if available | "Taking a bit longer than usual. Please wait..." |
| Database connection lost | Retry with local storage backup | "Temporarily saving your progress offline. It will sync when connection is restored." |
| Content generation fails | Use fallback content | "Loading alternative content..." |

## 5. Traceability Matrix

| Functional Requirement | Business Requirement | Product Vision Component |
| :---- | :---- | :---- |
| FR-001 to FR-010 | Natural interest discovery | AI-Powered Voice Interview System |
| FR-011 to FR-016 | Persistent personalization | Student Profile Management |
| FR-017 to FR-022 | Content transformation | Technical Architecture - Vector Storage |
| FR-023 to FR-030 | Engaging concept introduction | Dynamic Concept Content Generation |
| FR-031 to FR-040 | Mastery through articulation | Comprehensive Exercise & Mastery System |
| FR-041 to FR-047 | Sustained engagement | Progress Tracking & Gamification |
| FR-048 to FR-053 | Parent/educator visibility | Parent Dashboard |
| FR-054 to FR-058 | Comprehensive learning | Multi-Subject Support |
| FR-059 to FR-063 | Institutional support | Microschool Management |

This FRD ensures that every aspect of the Spool vision is translated into specific, testable requirements that the development team can implement and the QA team can validate.