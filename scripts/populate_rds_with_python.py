#!/usr/bin/env python3
"""
Populate RDS database-1 with thread data for all Spool users
"""

import os
import sys
import json
import random
import subprocess
from datetime import datetime, timedelta
from typing import List, Dict, Tuple

# Configuration
RDS_ENDPOINT = "database-1.cmtqo5bo1y3x.us-east-1.rds.amazonaws.com"
RDS_PORT = "5432"
DB_NAME = "spool"
DB_USERNAME = "postgres"
AWS_REGION = "us-east-1"

# Thread question templates
THREAD_QUESTIONS = [
    "How can I build a video game that teaches climate science?",
    "What math do I need to understand machine learning?",
    "How does the human brain process music and emotions?",
    "Can you explain quantum computing using everyday examples?",
    "How do I create a mobile app for environmental monitoring?",
    "What's the connection between art history and modern UI design?",
    "How can I use data science to analyze sports performance?",
    "What physics concepts are used in special effects?",
    "How do I build a robot that can navigate autonomously?",
    "What's the relationship between nutrition and cognitive performance?",
    "How can blockchain be used for social good?",
    "What chemistry is involved in cooking and baking?",
    "How do ecosystems maintain balance naturally?",
    "Can I use AI to compose original music?",
    "What's the science behind renewable energy sources?",
    "How do vaccines work at the molecular level?",
    "What programming languages should I learn for game development?",
    "How does GPS technology actually work?",
    "What's the psychology behind effective learning?",
    "How can I build a weather prediction system?",
    "What are the mathematical principles behind cryptography?",
    "How do neural networks mimic the human brain?",
    "What's the physics of flight and aerodynamics?",
    "How can I create sustainable architecture designs?",
    "What's the biology behind genetic engineering?",
    "How do search engines rank and organize information?",
    "What chemistry makes batteries work?",
    "How can I analyze literary patterns with data science?",
    "What's the science of sound engineering and acoustics?",
    "How do financial markets use mathematical models?"
]

# User data
USERS = [
    ("1418b4b8-d041-702f-7cc6-e37de4f3e9a4", "2spool4school@gmail.com"),
    ("14e80418-8021-705a-8e29-070904948c95", "shpoolbot@spool.com"),
    ("4478c408-f0c1-70a2-f256-6aa0916d9192", "dslunde@gmail.com"),
    ("54782488-80d1-700e-a811-61db1c08da10", "ahmadirad174@gmail.com"),
    ("6438d4b8-9021-70c9-0a2c-89e7ff07cd7b", "test@spool.com"),
    ("84088498-f081-7017-3133-740110ae1175", "getthatthread@gmail.com"),
    ("a4a85458-d091-709b-1b18-f63e982049a4", "yarnoflife@gmail.com"),
    ("c4482458-5001-70ec-64fa-45e6286a058e", "sean@gmail.com"),
    ("c4d814e8-5021-705c-dbb8-c1241f9e43c3", "hutchenbach@gmail.com"),
    ("d4b8c448-c0e1-70d4-3bb2-bf711cd5cddb", "dummy@gmail.com")
]

def get_db_password():
    """Get database password from SSM Parameter Store"""
    try:
        result = subprocess.run([
            'aws', 'ssm', 'get-parameter',
            '--name', '/spool/prod/rds/password',
            '--with-decryption',
            '--region', AWS_REGION,
            '--query', 'Parameter.Value',
            '--output', 'text'
        ], capture_output=True, text=True)
        
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception as e:
        print(f"Error retrieving password from SSM: {e}")
    
    return None

def get_thread_metadata(question: str) -> Dict:
    """Generate appropriate metadata based on the question"""
    metadata = {
        "interests": ["learning", "science", "technology", "discovery"],
        "subjects": ["Science", "Technology", "Engineering", "Mathematics", "Liberal Arts"],
        "topics": ["Problem Solving", "Critical Thinking", "Innovation", "Applied Learning", "Interdisciplinary Thinking"],
        "concepts": ["Analysis", "Design Thinking", "Implementation", "Evaluation", "Iteration", "Systems Thinking"],
        "summary": "Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.",
        "section_titles": ["Introduction to the Topic", "Core Concepts", "Practical Applications", "Advanced Techniques", "Project-Based Learning"]
    }
    
    # Customize based on question content
    if "game" in question and "climate" in question:
        metadata.update({
            "interests": ["gaming", "technology", "creativity", "education"],
            "subjects": ["Computer Science", "Environmental Science", "Physics", "Game Design", "Psychology"],
            "topics": ["Game Development", "Climate Modeling", "Educational Technology", "Interactive Media", "Behavioral Change"],
            "concepts": ["Game Engines", "Climate Systems", "Player Engagement", "Environmental Data Visualization", "Gamification"],
            "summary": "Explore the intersection of game development and climate science to create engaging educational experiences that teach environmental concepts through interactive gameplay and behavioral psychology.",
            "section_titles": ["Game Design Fundamentals", "Climate Science Basics", "Educational Game Mechanics", "Implementation Strategies", "Testing and Player Impact"]
        })
    elif "machine learning" in question:
        metadata.update({
            "interests": ["mathematics", "AI", "programming", "logic"],
            "subjects": ["Mathematics", "Computer Science", "Statistics", "Data Science", "Linear Algebra"],
            "topics": ["Linear Algebra", "Calculus", "Probability Theory", "Algorithm Design", "Optimization"],
            "concepts": ["Matrices", "Derivatives", "Gradient Descent", "Neural Networks", "Backpropagation", "Loss Functions"],
            "summary": "Master the mathematical foundations essential for understanding machine learning, from linear algebra to calculus and probability theory, with practical coding applications.",
            "section_titles": ["Mathematical Prerequisites", "Linear Algebra for ML", "Calculus in Optimization", "Statistical Foundations", "Practical ML Implementation"]
        })
    elif "brain" in question and "music" in question:
        metadata.update({
            "interests": ["arts", "creativity", "culture", "expression"],
            "subjects": ["Neuroscience", "Psychology", "Music Theory", "Biology", "Cognitive Science"],
            "topics": ["Auditory Processing", "Emotion and Cognition", "Neural Networks", "Music Perception", "Memory Formation"],
            "concepts": ["Auditory Cortex", "Dopamine Pathways", "Pattern Recognition", "Emotional Memory", "Neuroplasticity"],
            "summary": "Discover how the human brain processes music and generates emotional responses through complex neural mechanisms, psychological principles, and evolutionary adaptations.",
            "section_titles": ["The Auditory System", "Neural Processing of Music", "Emotion and Music", "Cultural and Individual Differences", "Music Therapy Applications"]
        })
    elif "quantum" in question:
        metadata.update({
            "interests": ["physics", "engineering", "innovation", "theory"],
            "subjects": ["Physics", "Computer Science", "Mathematics", "Engineering", "Philosophy"],
            "topics": ["Quantum Mechanics", "Quantum Gates", "Algorithms", "Applications", "Quantum Information"],
            "concepts": ["Superposition", "Entanglement", "Qubits", "Quantum Algorithms", "Decoherence", "Quantum Supremacy"],
            "summary": "Demystify quantum computing through everyday analogies and practical examples, making complex quantum concepts accessible while exploring future applications.",
            "section_titles": ["Classical vs Quantum", "Quantum Basics Explained", "How Quantum Computers Work", "Real-World Applications", "The Quantum Future"]
        })
    elif "blockchain" in question and "social" in question:
        metadata.update({
            "interests": ["technology", "economics", "social-impact", "innovation"],
            "subjects": ["Computer Science", "Economics", "Social Sciences", "Ethics", "Cryptography"],
            "topics": ["Distributed Systems", "Cryptocurrency", "Social Impact", "Transparency", "Decentralization"],
            "concepts": ["Consensus Mechanisms", "Smart Contracts", "Digital Identity", "Supply Chain", "Financial Inclusion"],
            "summary": "Explore how blockchain technology can address social challenges through transparency, decentralization, and innovative applications in healthcare, voting, and humanitarian aid.",
            "section_titles": ["Blockchain Fundamentals", "Social Impact Applications", "Case Studies", "Implementation Challenges", "Future Possibilities"]
        })
    
    return metadata

def generate_section_content(section_num: int, section_title: str) -> Tuple[str, str, int]:
    """Generate section content, difficulty, and estimated minutes"""
    section_texts = [
        "This foundational section introduces the key concepts and terminology you'll need to understand the topic. We'll explore the historical context and current relevance, setting up a solid base for deeper learning. You'll discover why this knowledge matters and how it connects to your interests.",
        "Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you'll gain a comprehensive understanding of how these concepts work together. We'll break down complex ideas into manageable pieces.",
        "See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You'll work through problems that professionals in this field encounter daily.",
        "Explore advanced concepts and cutting-edge developments in the field. We'll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.",
        "Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You'll apply what you've learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application."
    ]
    
    text = section_texts[min(section_num - 1, len(section_texts) - 1)]
    difficulty = "beginner" if section_num <= 2 else "intermediate" if section_num <= 4 else "advanced"
    estimated_minutes = random.randint(5, 12)
    
    return text, difficulty, estimated_minutes

def create_sql_script():
    """Create SQL script to populate the database"""
    sql_lines = []
    
    # Header
    sql_lines.append("-- Auto-generated SQL script to populate thread data")
    sql_lines.append(f"-- Generated at: {datetime.now().isoformat()}")
    sql_lines.append("-- This script populates threads for all 10 Cognito users")
    sql_lines.append("")
    
    # Create database if not exists
    sql_lines.append("-- Create database if not exists")
    sql_lines.append("SELECT 'CREATE DATABASE spool' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spool')\\gexec;")
    sql_lines.append("")
    
    # Connect to database
    sql_lines.append("\\c spool;")
    sql_lines.append("")
    
    # Transaction start
    sql_lines.append("BEGIN;")
    sql_lines.append("")
    
    thread_count = 0
    
    # Generate threads for each user
    for user_id, email in USERS:
        num_threads = random.randint(2, 5)  # 2-5 threads per user
        sql_lines.append(f"-- Threads for {email}")
        
        for i in range(num_threads):
            thread_count += 1
            thread_id = f"gen_random_uuid()"
            question = random.choice(THREAD_QUESTIONS)
            metadata = get_thread_metadata(question)
            created_at = datetime.now() - timedelta(days=random.randint(0, 30))
            
            # Insert thread
            sql_lines.append(f"INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)")
            sql_lines.append(f"VALUES (")
            sql_lines.append(f"    {thread_id},")
            sql_lines.append(f"    '{user_id}',")
            sql_lines.append(f"    '{question.replace("'", "''")}',")
            sql_lines.append(f"    'AI-generated learning thread for {email} exploring cross-curricular connections',")
            sql_lines.append(f"    ARRAY{metadata['interests']}::TEXT[],")
            sql_lines.append(f"    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],")
            sql_lines.append(f"    'active',")
            sql_lines.append(f"    '{created_at.isoformat()}',")
            sql_lines.append(f"    '{created_at.isoformat()}'")
            sql_lines.append(f");")
            sql_lines.append("")
            
            # Insert thread analysis
            sql_lines.append(f"INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)")
            sql_lines.append(f"VALUES (")
            sql_lines.append(f"    currval('threads_id_seq'),")
            sql_lines.append(f"    ARRAY{metadata['subjects']}::TEXT[],")
            sql_lines.append(f"    ARRAY{metadata['topics']}::TEXT[],")
            sql_lines.append(f"    ARRAY{metadata['concepts']}::TEXT[],")
            sql_lines.append(f"    '{metadata['summary'].replace("'", "''")}'")
            sql_lines.append(f");")
            sql_lines.append("")
            
            # Insert sections
            num_sections = random.randint(3, 5)
            for section_num in range(1, min(num_sections + 1, len(metadata['section_titles']) + 1)):
                section_title = metadata['section_titles'][section_num - 1]
                text, difficulty, minutes = generate_section_content(section_num, section_title)
                relevance_score = round(0.80 + random.random() * 0.15, 2)  # 0.80-0.95
                
                sql_lines.append(f"INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)")
                sql_lines.append(f"VALUES (")
                sql_lines.append(f"    currval('threads_id_seq'),")
                sql_lines.append(f"    {section_num},")
                sql_lines.append(f"    '{section_title}',")
                sql_lines.append(f"    '{text.replace("'", "''")}',")
                sql_lines.append(f"    {relevance_score},")
                sql_lines.append(f"    '{difficulty}',")
                sql_lines.append(f"    {minutes}")
                sql_lines.append(f");")
            
            sql_lines.append("")
    
    # Commit transaction
    sql_lines.append("COMMIT;")
    sql_lines.append("")
    
    # Summary
    sql_lines.append(f"-- Total threads to be created: {thread_count}")
    sql_lines.append("-- Verify with: SELECT COUNT(*) FROM threads;")
    
    return "\n".join(sql_lines)

def main():
    print("=== RDS Thread Data Population Script ===")
    print(f"Target: {RDS_ENDPOINT}")
    print(f"Database: {DB_NAME}")
    print(f"Users to populate: {len(USERS)}")
    print()
    
    # Get password
    password = get_db_password()
    if not password:
        print("Error: Could not retrieve database password from SSM")
        print("Please ensure the password is stored at: /spool/prod/rds/password")
        return 1
    
    # Generate SQL script
    print("Generating SQL script...")
    sql_script = create_sql_script()
    
    # Save SQL script
    sql_file = "/workspaces/spool-frontend/sql/populate-threads-auto-generated.sql"
    with open(sql_file, 'w') as f:
        f.write(sql_script)
    print(f"SQL script saved to: {sql_file}")
    
    # Create connection instructions
    print("\n=== Next Steps ===")
    print("Since psql is not available in this environment, you have two options:")
    print()
    print("Option 1: Use AWS CloudShell or EC2 instance")
    print("1. Open AWS CloudShell in your browser")
    print("2. Install PostgreSQL client: sudo yum install -y postgresql15")
    print("3. Copy the SQL file to CloudShell")
    print(f"4. Run: PGPASSWORD='{password}' psql -h {RDS_ENDPOINT} -U {DB_USERNAME} -d {DB_NAME} -f populate-threads-auto-generated.sql")
    print()
    print("Option 2: Use a Lambda function to execute the SQL")
    print("Create a Lambda function with psycopg2 layer to run the SQL commands")
    print()
    print("Option 3: Use a local PostgreSQL client")
    print(f"Connection string: postgresql://{DB_USERNAME}:{password}@{RDS_ENDPOINT}:{RDS_PORT}/{DB_NAME}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())