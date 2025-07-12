# Spool - Thread-Based Learning Data Flow Diagram (Supabase Architecture)

## 1. Introduction

This Data Flow Diagram (DFD) illustrates how data moves through the Spool Thread-based learning platform built on Supabase infrastructure. The diagram shows the revolutionary flow where students articulate learning goals through conversation, and the system dynamically assembles personalized Learning Threads by connecting relevant academic concepts from across all subjects. This document uses the Gane & Sarson notation to represent the system's data flows, processes, data stores, and external entities, with special emphasis on cross-curricular content discovery, the 80% relevance threshold that ensures quality, and Supabase Edge Functions that power all processing.

## 2. Key Components (Gane & Sarson Notation)

| Symbol | Name | Description | Spool Thread Examples |
| :---- | :---- | :---- | :---- |
| Rectangle | **External Entity** | People or systems outside Spool | Student, Parent, Educator, Thread Community |
| Circle | **Process** | Activities that transform data | Generate Thread, Map Concepts, Calculate Relevance |
| Open Rectangle | **Data Store** | Where data is held | Thread Graphs, Content Vectors, Learning Threads |
| Arrow | **Data Flow** | Movement of data | Learning Goal, Thread Visualization, Relevance Scores |

## 3. Context Diagram (Level 0) - Thread-Based Learning System

```mermaid
graph TB
    %% External Entities
    Student[Student<br/>External Entity]
    Parent[Parent/Educator<br/>External Entity]
    Admin[Admin/Publisher<br/>External Entity]
    Community[Thread Community<br/>External Entity]
    
    %% Single Process - Updated for Threads
    SpoolSystem((0.0<br/>Spool Thread-Based<br/>Learning<br/>Platform))
    
    %% Data Flows - Thread-Focused
    Student -->|Learning Goals<br/>Voice Conversations<br/>Thread Interactions| SpoolSystem
    SpoolSystem -->|Learning Threads<br/>Cross-Curricular Content<br/>Thread Progress| Student
    
    Parent -->|Student Setup<br/>Progress Requests| SpoolSystem
    SpoolSystem -->|Thread Journey Reports<br/>Mastery Evidence<br/>Learning Insights| Parent
    
    Admin -->|Textbook PDFs<br/>Content Configuration| SpoolSystem
    SpoolSystem -->|Processing Status<br/>Thread Analytics| Admin
    
    Community -->|Share Threads<br/>Browse Library| SpoolSystem
    SpoolSystem -->|Popular Threads<br/>Thread Templates<br/>Collaboration| Community
```

## 4. Level 1 Data Flow Diagram - Thread Architecture

```mermaid
graph TB
    %% External Entities
    Student[Student]
    Parent[Parent/Educator]
    Admin[Admin/Publisher]
    Community[Thread Community]
    
    %% Core Thread Processes
    P1((1.0<br/>Discover<br/>Learning<br/>Goal))
    P2((2.0<br/>Generate<br/>Learning<br/>Thread))
    P3((3.0<br/>Deliver<br/>Thread<br/>Content))
    P4((4.0<br/>Create<br/>Thread<br/>Exercises))
    P5((5.0<br/>Evaluate<br/>Thread<br/>Progress))
    P6((6.0<br/>Evolve<br/>Thread<br/>Path))
    P7((7.0<br/>Process<br/>Content<br/>Corpus))
    P8((8.0<br/>Manage<br/>Thread<br/>Community))
    
    %% Thread-Specific Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS2[(D2<br/>Pinecone<br/>Vectors<br/>80% Threshold)]
    DS3[(D3<br/>Neo4j<br/>Thread<br/>Graphs)]
    DS4[(D4<br/>PostgreSQL<br/>Thread<br/>Progress)]
    DS5[(D5<br/>Learning<br/>Threads)]
    DS6[(D6<br/>Content<br/>Corpus)]
    DS7[(D7<br/>Thread<br/>Library)]
    
    %% Student Thread Flows
    Student -->|Voice Conversation| P1
    P1 -->|Learning Goal| P2
    P2 -->|Thread Visualization| Student
    Student -->|Navigate Thread| P3
    P3 -->|Personalized Content| Student
    Student -->|Exercise Response| P5
    P5 -->|Thread Feedback| Student
    Student -->|Explore Branches| P6
    
    %% Parent Flows
    Parent -->|View Thread Journey| P5
    P5 -->|Thread Progress Report| Parent
    
    %% Admin Flows
    Admin -->|Upload Textbook| P7
    P7 -->|Processing Status| Admin
    
    %% Community Flows
    Student -->|Share Thread| P8
    Community -->|Browse Threads| P8
    P8 -->|Thread Templates| Community
    
    %% Process to Data Store - Thread Focus
    P1 -->|Goal & Context| DS1
    P2 -->|Thread Structure| DS3
    P2 -->|Thread Instance| DS5
    P3 -->|Progress Events| DS4
    P4 -->|Thread Exercises| DS5
    P5 -->|Mastery Updates| DS4
    P6 -->|Thread Evolution| DS3
    P7 -->|Content Vectors| DS2
    P7 -->|Structured Content| DS6
    P8 -->|Shared Threads| DS7
    
    %% Data Store to Process - Thread Operations
    DS1 -->|Student Context| P2
    DS2 -->|80% Relevant Content| P2
    DS3 -->|Thread Graph| P3
    DS3 -->|Prerequisites| P6
    DS4 -->|Thread Progress| P5
    DS5 -->|Active Thread| P3
    DS6 -->|Content Chunks| P7
    DS7 -->|Community Threads| P8
```

## 5. Level 2 DFD - Process 1.0: Discover Learning Goal

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes - Thread Discovery
    P1_1((1.1<br/>Conduct<br/>Text<br/>Interview))
    P1_2((1.2<br/>Extract<br/>Learning<br/>Objectives))
    P1_3((1.3<br/>Analyze<br/>Goal<br/>Scope))
    P1_4((1.4<br/>Identify<br/>Cross-Curricular<br/>Needs))
    P1_5((1.5<br/>Create<br/>Thread<br/>Proposal))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS8[(D8<br/>Interview<br/>Transcripts)]
    DS9[(D9<br/>Learning<br/>Goals)]
    
    %% Thread Discovery Flow
    Student -->|"I want to build a game"| P1_1
    P1_1 -->|Conversation Transcript| P1_2
    P1_1 -->|Audio → Text| DS8
    
    P1_2 -->|Structured Objectives| P1_3
    P1_3 -->|Depth & Breadth| P1_4
    
    P1_4 -->|Subject Requirements| P1_5
    DS1 -->|Student Interests| P1_5
    
    P1_5 -->|Thread Proposal| Student
    P1_5 -->|Goal Definition| DS9
```

### Learning Goal Discovery Data:
- **Conversation Topics**: "What are you curious about?", "What would you like to create?"
- **Learning Objectives**: Structured goals extracted by LLM
- **Subject Requirements**: Initial mapping of needed subjects
- **Thread Proposal**: Preliminary Thread concept with estimated scope

## 6. Level 2 DFD - Process 2.0: Generate Learning Thread

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes - Thread Generation
    P2_1((2.1<br/>Map<br/>Cross-Curricular<br/>Concepts))
    P2_2((2.2<br/>Generate<br/>Concept<br/>Embeddings))
    P2_3((2.3<br/>Search<br/>Vector<br/>Database))
    P2_4((2.4<br/>Apply<br/>80%<br/>Threshold))
    P2_5((2.5<br/>Build<br/>Thread<br/>Graph))
    P2_6((2.6<br/>Optimize<br/>Learning<br/>Sequence))
    P2_7((2.7<br/>Create<br/>Thread<br/>Visualization))
    
    %% Data Stores
    DS2[(D2<br/>Pinecone<br/>Vectors)]
    DS3[(D3<br/>Neo4j<br/>Graphs)]
    DS5[(D5<br/>Learning<br/>Threads)]
    DS9[(D9<br/>Learning<br/>Goals)]
    
    %% Thread Generation Flow
    DS9 -->|Learning Goal| P2_1
    P2_1 -->|Concept Map| P2_2
    
    P2_2 -->|Embeddings| P2_3
    DS2 -->|Vector Search| P2_3
    
    P2_3 -->|Similarity Scores| P2_4
    P2_4 -->|Relevant Content ≥80%| P2_5
    
    P2_5 -->|Thread Structure| DS3
    P2_5 -->|Graph Data| P2_6
    
    P2_6 -->|Optimized Sequence| P2_7
    P2_7 -->|Interactive Thread Map| Student
    P2_7 -->|Thread Instance| DS5
```

### Thread Generation Data:
- **Concept Map**: All concepts across subjects relevant to goal
- **Embeddings**: 1536-dimensional vectors for semantic search
- **Relevance Scores**: 0-100% similarity to learning goal
- **80% Threshold**: Only content ≥80% relevance included
- **Thread Graph**: Nodes (concepts) + Edges (relationships/prerequisites)

## 7. Level 2 DFD - Process 3.0: Deliver Thread Content

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes - Thread Content Delivery
    P3_1((3.1<br/>Get<br/>Thread<br/>Context))
    P3_2((3.2<br/>Retrieve<br/>Current<br/>Concept))
    P3_3((3.3<br/>Generate<br/>Cross-Curricular<br/>Bridge))
    P3_4((3.4<br/>Personalize<br/>Content))
    P3_5((3.5<br/>Show<br/>Thread<br/>Connections))
    P3_6((3.6<br/>Track<br/>Thread<br/>Progress))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS3[(D3<br/>Neo4j<br/>Graphs)]
    DS4[(D4<br/>Thread<br/>Progress)]
    DS5[(D5<br/>Active<br/>Threads)]
    DS6[(D6<br/>Content<br/>Corpus)]
    
    %% Content Flow with Thread Context
    Student -->|View Concept| P3_1
    DS5 -->|Active Thread| P3_1
    P3_1 -->|Thread Goal & Position| P3_2
    
    DS3 -->|Concept Node| P3_2
    DS6 -->|Base Content| P3_2
    P3_2 -->|Content + Relevance| P3_3
    
    P3_3 -->|Bridge Explanation| P3_4
    DS1 -->|Interests| P3_4
    P3_4 -->|Personalized Display| P3_5
    
    DS3 -->|Related Concepts| P3_5
    P3_5 -->|Enhanced Content| Student
    
    P3_1 -->|View Event| P3_6
    P3_6 -->|Progress Update| DS4
```

### Thread Content Elements:
- **Thread Context**: Current position in Thread, overall goal
- **Bridge Explanation**: Why this concept matters for the Thread
- **Cross-Curricular Connections**: Links to concepts from other subjects
- **Relevance Display**: Shows 80-100% relevance score
- **Progress Indicators**: Completed, current, upcoming concepts

## 8. Level 2 DFD - Process 4.0: Create Thread Exercises

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes - Thread Exercise Generation
    P4_1((4.1<br/>Get<br/>Thread<br/>Context))
    P4_2((4.2<br/>Identify<br/>Learning<br/>Goal))
    P4_3((4.3<br/>Generate<br/>Goal-Relevant<br/>Exercise))
    P4_4((4.4<br/>Include<br/>Cross-Concept<br/>Elements))
    P4_5((4.5<br/>Create<br/>Advanced<br/>Challenge))
    P4_6((4.6<br/>Generate<br/>Portfolio<br/>Project))
    
    %% Data Stores
    DS1[(D1<br/>Student<br/>Profiles)]
    DS3[(D3<br/>Thread<br/>Graphs)]
    DS5[(D5<br/>Active<br/>Threads)]
    DS10[(D10<br/>Thread<br/>Exercises)]
    
    %% Thread Exercise Flow
    Student -->|Start Exercise| P4_1
    DS5 -->|Thread Instance| P4_1
    P4_1 -->|Goal & Progress| P4_2
    
    DS3 -->|Learning Objectives| P4_2
    P4_2 -->|Goal Context| P4_3
    
    DS1 -->|Interests| P4_3
    P4_3 -->|Initial Exercise| Student
    P4_3 -->|Exercise Data| DS10
    
    P4_1 -->|Multiple Concepts| P4_4
    P4_4 -->|Integrated Problem| P4_5
    
    P4_5 -->|Advanced Exercise| Student
    P4_5 -->|Challenge Data| DS10
    
    P4_1 -->|Thread Completion| P4_6
    P4_6 -->|Portfolio Project| Student
```

### Thread Exercise Features:
- **Goal Integration**: Every exercise relates to Thread's learning goal
- **Cross-Concept Problems**: Exercises combining multiple Thread concepts
- **Thread Context**: "In your game development journey..."
- **Portfolio Projects**: Culminating demonstrations of Thread mastery

## 9. Level 2 DFD - Process 5.0: Evaluate Thread Progress

```mermaid
graph TB
    %% External Entity
    Student[Student]
    Parent[Parent]
    
    %% Sub-processes - Thread Progress Evaluation
    P5_1((5.1<br/>Assess<br/>Concept<br/>Mastery))
    P5_2((5.2<br/>Update<br/>Thread<br/>Progress))
    P5_3((5.3<br/>Calculate<br/>Thread<br/>Completion))
    P5_4((5.4<br/>Identify<br/>Knowledge<br/>Transfer))
    P5_5((5.5<br/>Generate<br/>Thread<br/>Report))
    P5_6((5.6<br/>Award<br/>Thread<br/>Achievements))
    
    %% Data Stores
    DS3[(D3<br/>Thread<br/>Graphs)]
    DS4[(D4<br/>Thread<br/>Progress)]
    DS11[(D11<br/>Thread<br/>Achievements)]
    DS12[(D12<br/>Progress<br/>Reports)]
    
    %% Progress Evaluation Flow
    Student -->|Complete Exercise| P5_1
    P5_1 -->|Mastery Status| P5_2
    
    DS3 -->|Thread Structure| P5_2
    P5_2 -->|Node Updates| DS4
    
    DS4 -->|All Progress| P5_3
    P5_3 -->|% Complete| P5_5
    
    P5_2 -->|Cross-Thread Learning| P5_4
    P5_4 -->|Transfer Insights| P5_5
    
    Parent -->|Request Report| P5_5
    P5_5 -->|Thread Journey Report| Parent
    P5_5 -->|Report Data| DS12
    
    P5_3 -->|Milestones| P5_6
    DS11 -->|Achievement Criteria| P5_6
    P5_6 -->|Thread Badges| Student
```

### Thread Progress Metrics:
- **Thread Completion**: % of Thread concepts mastered
- **Cross-Curricular Connections**: Subjects successfully integrated
- **Knowledge Transfer**: Concepts applied across Threads
- **Thread Achievements**: "Game Dev Thread Master", "Climate Explorer"

## 10. Level 2 DFD - Process 6.0: Evolve Thread Path

```mermaid
graph TB
    %% External Entity
    Student[Student]
    
    %% Sub-processes - Thread Evolution
    P6_1((6.1<br/>Monitor<br/>Student<br/>Curiosity))
    P6_2((6.2<br/>Suggest<br/>Thread<br/>Branches))
    P6_3((6.3<br/>Create<br/>Branch<br/>Point))
    P6_4((6.4<br/>Merge<br/>Thread<br/>Paths))
    P6_5((6.5<br/>Adapt<br/>Thread<br/>Depth))
    P6_6((6.6<br/>Record<br/>Thread<br/>Evolution))
    
    %% Data Stores
    DS3[(D3<br/>Neo4j<br/>Graphs)]
    DS5[(D5<br/>Active<br/>Threads)]
    DS13[(D13<br/>Thread<br/>History)]
    
    %% Thread Evolution Flow
    Student -->|Show Interest| P6_1
    P6_1 -->|Curiosity Signals| P6_2
    
    DS3 -->|Related Concepts| P6_2
    P6_2 -->|Branch Options| Student
    
    Student -->|Select Branch| P6_3
    P6_3 -->|New Path| DS3
    P6_3 -->|Updated Thread| DS5
    
    DS5 -->|Multiple Threads| P6_4
    P6_4 -->|Merged Path| DS3
    
    Student -->|Pace Feedback| P6_5
    P6_5 -->|Adjusted Depth| DS5
    
    P6_3 -->|Evolution Event| P6_6
    P6_6 -->|Thread History| DS13
```

### Thread Evolution Features:
- **Branch Points**: Opportunities to explore related topics
- **Thread Merging**: When paths converge on similar concepts
- **Depth Adaptation**: Adjusting complexity based on engagement
- **Evolution History**: Complete record of Thread journey

## 11. Level 2 DFD - Process 7.0: Process Content Corpus

```mermaid
graph TB
    %% External Entity
    Admin[Admin/Publisher]
    
    %% Sub-processes - Content Processing for Threads
    P7_1((7.1<br/>Upload<br/>Textbook))
    P7_2((7.2<br/>Extract<br/>Content))
    P7_3((7.3<br/>Identify<br/>Concepts))
    P7_4((7.4<br/>Generate<br/>Embeddings))
    P7_5((7.5<br/>Index<br/>in<br/>Pinecone))
    P7_6((7.6<br/>Build<br/>Concept<br/>Graph))
    P7_7((7.7<br/>Map<br/>Prerequisites))
    
    %% Data Stores
    DS2[(D2<br/>Pinecone<br/>Vectors)]
    DS3[(D3<br/>Neo4j<br/>Graphs)]
    DS6[(D6<br/>Content<br/>Corpus)]
    DS14[(D14<br/>Processing<br/>Queue)]
    
    %% Content Processing Flow
    Admin -->|Textbook PDF| P7_1
    P7_1 -->|Queue Entry| DS14
    P7_1 -->|Processing Status| Admin
    
    DS14 -->|Next PDF| P7_2
    P7_2 -->|Structured Text| P7_3
    
    P7_3 -->|Concept List| P7_4
    P7_3 -->|Content Chunks| DS6
    
    P7_4 -->|1536-D Vectors| P7_5
    P7_5 -->|Indexed Vectors| DS2
    
    P7_3 -->|Concept Nodes| P7_6
    P7_6 -->|Graph Structure| DS3
    
    P7_6 -->|Relationships| P7_7
    P7_7 -->|Prerequisites| DS3
```

### Content Processing for Threads:
- **Concept Extraction**: Identifying discrete learnable units
- **Embedding Generation**: OpenAI text-embedding-ada-002
- **Vector Indexing**: Pinecone with subject/topic metadata
- **Graph Building**: Neo4j nodes for cross-curricular mapping
- **Prerequisite Mapping**: Both within and across subjects

## 12. Level 2 DFD - Process 8.0: Manage Thread Community

```mermaid
graph TB
    %% External Entities
    Student[Student]
    Community[Thread<br/>Community]
    Educator[Educator]
    
    %% Sub-processes - Community Features
    P8_1((8.1<br/>Share<br/>Thread))
    P8_2((8.2<br/>Browse<br/>Thread<br/>Library))
    P8_3((8.3<br/>Remix<br/>Thread))
    P8_4((8.4<br/>Endorse<br/>Thread))
    P8_5((8.5<br/>Track<br/>Thread<br/>Popularity))
    P8_6((8.6<br/>Facilitate<br/>Collaboration))
    
    %% Data Stores
    DS7[(D7<br/>Thread<br/>Library)]
    DS15[(D15<br/>Thread<br/>Metadata)]
    DS16[(D16<br/>Community<br/>Activity)]
    
    %% Community Flow
    Student -->|Publish Thread| P8_1
    P8_1 -->|Public Thread| DS7
    P8_1 -->|Share Notification| Community
    
    Community -->|Search Threads| P8_2
    DS7 -->|Thread List| P8_2
    P8_2 -->|Thread Results| Community
    
    Community -->|Fork Thread| P8_3
    P8_3 -->|New Variant| DS7
    P8_3 -->|Attribution| DS15
    
    Educator -->|Review Thread| P8_4
    P8_4 -->|Endorsement| DS15
    
    DS16 -->|Usage Data| P8_5
    P8_5 -->|Popularity Metrics| DS15
    
    Student -->|Join Group| P8_6
    P8_6 -->|Collaboration Space| Community
```

## 13. Thread-Specific Data Dictionary

### Thread Data Elements

| Data Element | Description | Format | Example |
|--------------|-------------|---------|---------|
| Learning Goal | Student's articulated curiosity | Text | "I want to build my own video game" |
| Thread ID | Unique Thread identifier | UUID | "thread_2025_game_dev_001" |
| Concept Relevance | Similarity to learning goal | Float 0-1 | 0.87 (87% relevant) |
| Thread Graph | Neo4j representation | Cypher | `(t:Thread)-[:CONTAINS]->(c:Concept)` |
| Cross-Curricular Bridge | Explanation of connection | Text | "Physics helps with realistic game movement" |
| Thread Progress | Completion state | JSON | `{"completed": 15, "total": 42, "current": "physics_vectors"}` |

### Pinecone Vector Data

| Field | Description | Type | Constraints |
|-------|-------------|------|-------------|
| vector_id | Unique identifier | String | concept_{subject}_{topic}_{id} |
| values | Embedding vector | Float[1536] | Normalized |
| metadata.subject | Academic subject | String | One of 8 subjects |
| metadata.relevance_score | Thread relevance | Float | Must be ≥0.80 for inclusion |
| metadata.prerequisites | Required concepts | Array | Concept IDs |

### Neo4j Graph Schema

```cypher
// Thread Node
(t:Thread {
    id: String,
    goal: String,
    user_id: String,
    created: DateTime,
    status: String // 'active', 'completed', 'branched'
})

// Concept Node  
(c:Concept {
    id: String,
    name: String,
    subject: String,
    difficulty: String
})

// Thread Contains Concept
(t)-[:CONTAINS {
    sequence: Integer,
    relevance: Float, // 0.80-1.00
    status: String // 'pending', 'current', 'completed'
}]->(c)

// Cross-Curricular Bridge
(c1)-[:BRIDGES_TO {
    thread_id: String,
    explanation: String,
    strength: Float
}]->(c2)
```

## 14. Critical Data Flow Rules

### Thread Generation Rules
1. **80% Threshold Rule**: Only content with ≥80% relevance to learning goal included
2. **Cross-Curricular Rule**: Every Thread must span at least 2 subjects
3. **Sequence Rule**: Prerequisites must be completed before dependent concepts
4. **Branch Rule**: Students can explore branches without abandoning main Thread

### Content Delivery Rules
1. **Context Rule**: Every concept must show Thread goal relevance
2. **Bridge Rule**: Cross-subject transitions require explicit explanations
3. **Progress Rule**: Thread visualization updates in real-time
4. **Transfer Rule**: Completed concepts available across all user's Threads

### Community Rules
1. **Attribution Rule**: Remixed Threads maintain original creator credit
2. **Privacy Rule**: Students control Thread sharing permissions
3. **Quality Rule**: Only educator-endorsed Threads featured
4. **Collaboration Rule**: Thread groups limited to 20 students

## 15. Performance Constraints

### Vector Search Performance
- **Pinecone Query**: <100ms for 10 concepts
- **Relevance Calculation**: Real-time during search
- **Result Set**: Maximum 1000 vectors per query
- **Batch Processing**: 100 concepts per Thread generation

### Graph Traversal Performance  
- **Neo4j Query**: <50ms for Thread path
- **Prerequisite Check**: <20ms per concept
- **Branch Discovery**: <100ms for 5 options
- **Thread Merge**: <200ms for convergence check

## 16. Thread-Based Architecture Benefits

1. **Curiosity-Driven**: Learning paths follow student interests
2. **Cross-Curricular**: Natural integration across subjects
3. **Quality Assured**: 80% threshold ensures relevance
4. **Dynamic**: Threads evolve with student exploration
5. **Community**: Shared learning journeys inspire others
6. **Measurable**: Clear progress through Thread completion

This Thread-based data flow architecture transforms education from rigid subject silos into dynamic, interconnected learning journeys where student curiosity truly drives the curriculum.