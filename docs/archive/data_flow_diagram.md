# Spool - Data Flow Diagram

## 1. Introduction

This Data Flow Diagram (DFD) illustrates how data moves through the Spool personalized learning management system. The diagram shows the flow of educational content from textbooks through AI processing to personalized student experiences, as well as the complete data lifecycle from student onboarding through mastery achievement. This document uses the Gane & Sarson notation to represent the system's data flows, processes, data stores, and external entities.

## 2. Key Components (Gane & Sarson Notation)

| Symbol | Name | Description | Spool Examples |
| :---- | :---- | :---- | :---- |
| Rectangle | **External Entity** | People or systems outside Spool that provide or receive data | Student, Parent, Educator, Admin, Publisher |
| Circle | **Process** | Activities that transform data | Voice Interview, Generate Exercise, Evaluate Response |
| Open Rectangle | **Data Store** | Where data is held for later use | Student Profiles, Content Vectors, Learning Progress |
| Arrow | **Data Flow** | Movement of data between components | Interview Audio, Personalized Content, Progress Report |

## 3. Context Diagram (Level 0)

```mermaid
graph TB
    %% External Entities
    Student[Student<br/>External Entity]
    Parent[Parent/Educator<br/>External Entity]
    Admin[Admin/Publisher<br/>External Entity]
    Microschool[Microschool<br/>Organization]
    
    %% Single Process
    SpoolSystem((0.0<br/>Spool<br/>Learning<br/>System))
    
    %% Data Flows
    Student -->|Voice Audio<br/>Exercise Responses<br/>Learning Interactions| SpoolSystem
    SpoolSystem -->|Personalized Lessons<br/>Feedback<br/>Progress Updates| Student
    
    Parent -->|Student Setup<br/>Access Requests| SpoolSystem
    SpoolSystem -->|Progress Reports<br/>Competency Evidence<br/>Alerts| Parent
    
    Admin -->|Textbook PDFs<br/>Content Configuration| SpoolSystem
    SpoolSystem -->|Processing Status<br/>Analytics| Admin
    
    Microschool -->|Bulk Operations<br/>Organization Settings| SpoolSystem
    SpoolSystem -->|Aggregate Analytics<br/>Student Rosters| Microschool
```

## 4. Level 1 Data Flow Diagram

```mermaid
graph TB
    %% External Entities
    Student[Student]
    Parent[Parent/Educator]
    Admin[Admin/Publisher]
    Microschool[Microschool]
    
    %% Processes
    P1((1.0<br/>Conduct<br/>Voice<br/>Interview))
    P2((2.0<br/>Process<br/>Educational<br/>Content))
    P3((3.0<br/>Generate<br/>Personalized<br/>Lessons))
    P4((4.0<br/>Create<br/>Exercises))
    P5((5.0<br/>Evaluate<br/>Responses))
    P6((6.0<br/>Track<br/>Progress))
    P7((7.0<br/>Manage<br/>Organization))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS2[(D2<br/>Content<br/>Vectors)]
    DS3[(D3<br/>Knowledge<br/>Graph)]
    DS4[(D4<br/>Learning<br/>Progress)]
    DS5[(D5<br/>Exercise<br/>Bank)]
    DS6[(D6<br/>Organizations)]
    
    %% Student Flows
    Student -->|Voice Audio| P1
    P1 -->|Interest Profile| DS1
    Student -->|Content Request| P3
    Student -->|Exercise Response| P5
    P3 -->|Personalized Content| Student
    P4 -->|Personalized Exercise| Student
    P5 -->|Feedback & Score| Student
    
    %% Parent Flows
    Parent -->|Student Info| P1
    Parent -->|Progress Request| P6
    P6 -->|Progress Report| Parent
    
    %% Admin Flows
    Admin -->|Textbook PDF| P2
    P2 -->|Processing Status| Admin
    
    %% Microschool Flows
    Microschool -->|Organization Data| P7
    P7 -->|Analytics Dashboard| Microschool
    
    %% Process to Data Store
    P1 -->|Interview Data| DS1
    P2 -->|Content Chunks| DS2
    P2 -->|Concept Hierarchy| DS3
    P3 -->|Session Events| DS4
    P4 -->|Generated Exercises| DS5
    P5 -->|Assessment Results| DS4
    P6 -->|Progress Updates| DS4
    P7 -->|Organization Config| DS6
    
    %% Data Store to Process
    DS1 -->|Student Interests| P3
    DS1 -->|Student Interests| P4
    DS2 -->|Content Vectors| P3
    DS3 -->|Learning Path| P3
    DS3 -->|Concept Requirements| P4
    DS4 -->|Mastery Status| P3
    DS4 -->|Progress Data| P6
    DS5 -->|Exercise Templates| P4
    DS6 -->|Access Rights| P7
```

## 5. Level 2 DFD - Process 1.0: Conduct Voice Interview

```mermaid
graph TB
    %% External Entities
    Student[Student]
    Parent[Parent]
    
    %% Sub-processes
    P1_1((1.1<br/>Establish<br/>WebRTC<br/>Connection))
    P1_2((1.2<br/>Stream<br/>Audio))
    P1_3((1.3<br/>Transcribe<br/>Speech))
    P1_4((1.4<br/>Generate<br/>AI<br/>Questions))
    P1_5((1.5<br/>Analyze<br/>Interests))
    P1_6((1.6<br/>Create<br/>Profile))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS7[(D7<br/>Interview<br/>Sessions)]
    DS8[(D8<br/>Transcripts)]
    
    %% Data Flows
    Student -->|Start Interview| P1_1
    Parent -->|Student Name/Age| P1_6
    
    P1_1 -->|Connection Status| Student
    P1_1 -->|Audio Channel| P1_2
    
    Student -->|Voice Input| P1_2
    P1_2 -->|Audio Stream| P1_3
    P1_2 -->|Chat Display| Student
    
    P1_3 -->|Text Transcript| P1_4
    P1_3 -->|Transcript Data| DS8
    
    P1_4 -->|AI Question| P1_2
    P1_4 -->|Question Context| P1_5
    
    P1_5 -->|Interest Categories| P1_6
    P1_5 -->|Session Data| DS7
    
    P1_6 -->|Complete Profile| DS1
    P1_6 -->|Profile Summary| Student
```

### Data Elements:
- **Audio Stream**: 16kHz mono PCM audio
- **Text Transcript**: UTF-8 text with timestamps
- **Interest Categories**: JSON array with personal, social, career, philanthropic classifications
- **Complete Profile**: Student name, age, 5+ interests with categories and strength scores

## 6. Level 2 DFD - Process 2.0: Process Educational Content

```mermaid
graph TB
    %% External Entity
    Admin[Admin/Publisher]
    
    %% Sub-processes
    P2_1((2.1<br/>Upload<br/>Textbook))
    P2_2((2.2<br/>Extract<br/>Text))
    P2_3((2.3<br/>Parse<br/>Structure))
    P2_4((2.4<br/>Chunk<br/>Content))
    P2_5((2.5<br/>Generate<br/>Embeddings))
    P2_6((2.6<br/>Build<br/>Hierarchy))
    P2_7((2.7<br/>Create<br/>Hooks))
    
    %% Data Stores
    DS2[(D2<br/>Content<br/>Vectors)]
    DS3[(D3<br/>Knowledge<br/>Graph)]
    DS9[(D9<br/>Raw<br/>Textbooks)]
    DS10[(D10<br/>Content<br/>Matrix)]
    
    %% Data Flows
    Admin -->|Textbook PDF| P2_1
    P2_1 -->|Upload Status| Admin
    P2_1 -->|PDF File| DS9
    P2_1 -->|PDF Data| P2_2
    
    P2_2 -->|Raw Text| P2_3
    P2_3 -->|Structure Map| P2_4
    P2_3 -->|Hierarchy Data| P2_6
    
    P2_4 -->|Content Chunks| P2_5
    P2_4 -->|Hook Templates| P2_7
    
    P2_5 -->|Vector Data| DS2
    P2_6 -->|Graph Nodes| DS3
    P2_7 -->|Hook Content| DS10
```

### Content Processing Data:
- **Structure Map**: Subject→Topic→Section→Concept hierarchy
- **Content Chunks**: 500-1000 character segments with metadata
- **Vector Data**: 1536-dimensional embeddings with concept tags
- **Hook Content**: 4 life-category hooks per concept

## 7. Level 2 DFD - Process 3.0: Generate Personalized Lessons

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes
    P3_1((3.1<br/>Receive<br/>Content<br/>Request))
    P3_2((3.2<br/>Check<br/>Progress))
    P3_3((3.3<br/>Select<br/>Next<br/>Concept))
    P3_4((3.4<br/>Retrieve<br/>Hooks))
    P3_5((3.5<br/>Match<br/>Examples))
    P3_6((3.6<br/>Assemble<br/>Content))
    P3_7((3.7<br/>Track<br/>Interaction))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS2[(D2<br/>Content<br/>Vectors)]
    DS3[(D3<br/>Knowledge<br/>Graph)]
    DS4[(D4<br/>Learning<br/>Progress)]
    DS10[(D10<br/>Content<br/>Matrix)]
    
    %% Data Flows
    Student -->|View Concept| P3_1
    P3_1 -->|Student ID| P3_2
    
    DS4 -->|Completed Concepts| P3_2
    P3_2 -->|Progress Status| P3_3
    
    DS3 -->|Prerequisites| P3_3
    P3_3 -->|Concept ID| P3_4
    P3_3 -->|Concept ID| P3_5
    
    DS1 -->|Interest Profile| P3_4
    DS10 -->|Hook Options| P3_4
    P3_4 -->|Selected Hooks| P3_6
    
    DS1 -->|Interest Tags| P3_5
    DS2 -->|Example Content| P3_5
    P3_5 -->|Matched Examples| P3_6
    
    P3_6 -->|Complete Lesson| Student
    P3_6 -->|View Events| P3_7
    
    P3_7 -->|Interaction Data| DS4
```

### Personalization Logic:
- **Hook Selection**: Career and philanthropic hooks matched to primary interests
- **Example Matching**: Top 3-4 examples based on interest tag overlap
- **Content Assembly**: Hooks → Examples → Core Explanation in fixed order

## 8. Level 2 DFD - Process 4.0: Create Exercises

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes
    P4_1((4.1<br/>Identify<br/>Concept))
    P4_2((4.2<br/>Get<br/>Student<br/>Context))
    P4_3((4.3<br/>Select<br/>Life<br/>Category))
    P4_4((4.4<br/>Generate<br/>Exercise<br/>Prompt))
    P4_5((4.5<br/>Create<br/>Initial<br/>Exercise))
    P4_6((4.6<br/>Generate<br/>Advanced<br/>Exercise))
    P4_7((4.7<br/>Store<br/>Exercise))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS3[(D3<br/>Knowledge<br/>Graph)]
    DS5[(D5<br/>Exercise<br/>Bank)]
    DS11[(D11<br/>Exercise<br/>Templates)]
    
    %% Data Flows
    Student -->|Start Exercise| P4_1
    P4_1 -->|Concept Requirements| P4_2
    
    DS3 -->|Learning Objectives| P4_1
    DS1 -->|Interests & Context| P4_2
    
    P4_2 -->|Context Data| P4_3
    P4_3 -->|Category Selection| P4_4
    
    DS11 -->|Prompt Templates| P4_4
    P4_4 -->|Personalized Prompt| P4_5
    
    P4_5 -->|Initial Exercise| Student
    P4_5 -->|Exercise Data| P4_7
    
    P4_2 -->|Context Data| P4_6
    P4_6 -->|Advanced Exercise| Student
    P4_6 -->|Exercise Data| P4_7
    
    P4_7 -->|Stored Exercises| DS5
```

### Exercise Generation Data:
- **Life Category**: One of personal, social, career, philanthropic
- **Personalized Prompt**: Template + student interests + concept requirements
- **Exercise Levels**: Initial (basic application) and Advanced (complex synthesis)

## 9. Level 2 DFD - Process 5.0: Evaluate Responses

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes
    P5_1((5.1<br/>Receive<br/>Response))
    P5_2((5.2<br/>Extract<br/>Steps))
    P5_3((5.3<br/>Compare<br/>Logic))
    P5_4((5.4<br/>Identify<br/>Gaps))
    P5_5((5.5<br/>Generate<br/>Remediation))
    P5_6((5.6<br/>Calculate<br/>Score))
    P5_7((5.7<br/>Update<br/>Progress))
    
    %% Data Stores
    DS3[(D3<br/>Knowledge<br/>Graph)]
    DS4[(D4<br/>Learning<br/>Progress)]
    DS5[(D5<br/>Exercise<br/>Bank)]
    DS12[(D12<br/>Assessment<br/>Results)]
    
    %% Data Flows
    Student -->|Thought Process| P5_1
    P5_1 -->|Response Text| P5_2
    
    P5_2 -->|Identified Steps| P5_3
    DS3 -->|Expected Steps| P5_3
    
    P5_3 -->|Step Comparison| P5_4
    P5_4 -->|Gap Analysis| P5_5
    P5_4 -->|Mastery Status| P5_6
    
    P5_5 -->|Remediation Exercise| Student
    P5_5 -->|Remediation Data| DS5
    
    P5_6 -->|Competency Score| P5_7
    P5_6 -->|Detailed Feedback| Student
    
    P5_7 -->|Progress Update| DS4
    P5_7 -->|Assessment Record| DS12
```

### Evaluation Data:
- **Identified Steps**: Array of logical steps extracted from response
- **Step Comparison**: Correct, missing, or incorrect classification for each step
- **Competency Score**: 0.0-1.0 based on step accuracy
- **Remediation Exercise**: Targeted exercise for first incorrect step

## 10. Level 2 DFD - Process 6.0: Track Progress

```mermaid
graph TB
    %% External Entity
    Parent[Parent/Educator]
    Student[Student]
    
    %% Sub-processes
    P6_1((6.1<br/>Calculate<br/>Metrics))
    P6_2((6.2<br/>Update<br/>Streaks))
    P6_3((6.3<br/>Award<br/>Points))
    P6_4((6.4<br/>Check<br/>Achievements))
    P6_5((6.5<br/>Generate<br/>Reports))
    P6_6((6.6<br/>Send<br/>Alerts))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS4[(D4<br/>Learning<br/>Progress)]
    DS13[(D13<br/>Achievements)]
    DS14[(D14<br/>Reports)]
    
    %% Data Flows
    Parent -->|View Progress| P6_5
    DS4 -->|Activity Data| P6_1
    
    P6_1 -->|Completion %| P6_5
    P6_1 -->|Time Metrics| P6_2
    
    P6_2 -->|Streak Count| DS1
    P6_2 -->|Streak Status| P6_3
    
    P6_3 -->|Point Total| DS1
    P6_3 -->|Points Earned| P6_4
    
    DS13 -->|Badge Criteria| P6_4
    P6_4 -->|New Badges| DS1
    P6_4 -->|Achievement Alert| Student
    
    P6_5 -->|Progress Report| Parent
    P6_5 -->|Report Data| DS14
    
    P6_1 -->|Inactivity Check| P6_6
    P6_6 -->|Alert Message| Parent
```

### Progress Tracking Data:
- **Completion %**: (mastered_concepts / total_concepts) * 100
- **Streak Count**: Consecutive days with learning activity
- **Points**: 10 for initial exercise, 15 for advanced exercise
- **Achievement Criteria**: JSON rules for badge awards

## 11. Level 2 DFD - Process 7.0: Manage Organization

```mermaid
graph TB
    %% External Entity
    Microschool[Microschool<br/>Administrator]
    
    %% Sub-processes
    P7_1((7.1<br/>Create<br/>Organization))
    P7_2((7.2<br/>Add<br/>Students))
    P7_3((7.3<br/>Assign<br/>Content))
    P7_4((7.4<br/>Set<br/>Permissions))
    P7_5((7.5<br/>Generate<br/>Analytics))
    P7_6((7.6<br/>Manage<br/>Educators))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS6[(D6<br/>Organizations)]
    DS15[(D15<br/>Permissions)]
    DS16[(D16<br/>Analytics)]
    
    %% Data Flows
    Microschool -->|Org Details| P7_1
    P7_1 -->|Org ID| DS6
    
    Microschool -->|Student List| P7_2
    P7_2 -->|Student Records| DS1
    P7_2 -->|Org Association| DS6
    
    Microschool -->|Content Access| P7_3
    P7_3 -->|Access Rights| DS15
    
    Microschool -->|Role Assignment| P7_4
    P7_4 -->|Permission Set| DS15
    
    Microschool -->|Analytics Request| P7_5
    DS6 -->|Student IDs| P7_5
    DS4 -->|Progress Data| P7_5
    P7_5 -->|Analytics Report| Microschool
    P7_5 -->|Report Cache| DS16
    
    Microschool -->|Educator Info| P7_6
    P7_6 -->|Access Control| DS15
```

## 12. Data Dictionary

### External Entity Data

| Data Element | Description | Format | Size |
|--------------|-------------|---------|------|
| Voice Audio | Student's spoken responses during interview | 16kHz PCM mono | ~1MB/min |
| Exercise Response | Student's written thought process | UTF-8 text | 50-2000 chars |
| Textbook PDF | Educational content from publishers | PDF binary | 10-500MB |
| Student Info | Name, birthday, parent contact | JSON | <1KB |
| Progress Request | Query for specific student/date range | HTTP GET params | <100 bytes |

### Process Data

| Data Element | Description | Format | Example |
|--------------|-------------|---------|---------|
| Interest Profile | Categorized student interests | JSON array | `[{"interest": "gaming", "category": "personal", "strength": 0.9}]` |
| Content Chunk | Segmented textbook content | JSON | `{"text": "...", "concept_id": "math_iteration_001", "type": "explanation"}` |
| Vector Embedding | Semantic representation | Float array[1536] | `[0.021, -0.134, ...]` |
| Personalized Exercise | Context-aware problem | JSON | `{"prompt": "Your gaming clan needs to calculate...", "expected_steps": [...]}` |
| Competency Score | Mastery evaluation | Float 0.0-1.0 | `0.85` |

### Data Store Contents

| Data Store | Key Elements | Update Frequency |
|------------|--------------|------------------|
| D1: Student Profiles | Name, interests, badges, points | Real-time |
| D2: Content Vectors | Embeddings, metadata, concept IDs | On content upload |
| D3: Knowledge Graph | Concept hierarchy, prerequisites | On content upload |
| D4: Learning Progress | Mastery status, time spent, attempts | After each interaction |
| D5: Exercise Bank | Generated exercises, remediation | As created |
| D6: Organizations | Settings, student associations | On admin changes |

## 13. Data Flow Rules

1. **Privacy Rule**: Voice audio is processed in real-time and never stored permanently
2. **Prerequisite Rule**: Students cannot access concepts without completing prerequisites
3. **Personalization Rule**: All content requests must include student profile for customization
4. **Mastery Rule**: Concepts require both initial and advanced exercise completion
5. **Consistency Rule**: Progress updates are atomic transactions to prevent partial states
6. **Access Rule**: All data access is filtered by organization permissions

## 14. Key Design Decisions

1. **Real-time Processing**: Voice interviews use streaming to avoid audio storage
2. **Vector-based Retrieval**: Content matching uses semantic similarity for flexibility
3. **Graph-based Prerequisites**: Neo4j enables complex learning path relationships
4. **Step-wise Evaluation**: Exercise responses are decomposed for precise feedback
5. **Event-driven Analytics**: All interactions generate events for comprehensive tracking

This comprehensive DFD provides a complete view of how data flows through the Spool system, from initial student onboarding through content personalization and mastery achievement. Each process is decomposed to show the specific transformations and data stores involved in delivering personalized education.