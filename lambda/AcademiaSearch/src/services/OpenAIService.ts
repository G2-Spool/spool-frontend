import OpenAI from 'openai';

export interface AcademicAnalysis {
  descriptions: string[];
  primaryTopic: string;
  primaryCategory: string;
}

export interface StudentProfile {
  interests: Array<{
    interest: string;
    category: string;
    strength: number;
  }>;
  firstName?: string;
  grade?: string;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async analyzeAcademicTopics(
    question: string,
    studentProfile: StudentProfile
  ): Promise<AcademicAnalysis> {
    try {
      const systemPrompt = this.buildSystemPrompt(studentProfile);
      const userPrompt = this.buildUserPrompt(question);

      console.log('🤖 Calling OpenAI for academic analysis...');
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      console.log('📝 OpenAI analysis completed');
      return this.parseResponse(response);

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to analyze academic topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSystemPrompt(studentProfile: StudentProfile): string {
    const interests = studentProfile.interests
      .map(i => `${i.interest} (${i.category}, strength: ${i.strength})`)
      .join(', ');

    return `You are an expert academic advisor and educational AI that specializes in analyzing student questions to identify key academic subjects, topics, and concepts.

Your task is to analyze the student's question and provide exactly 5 intelligent, comprehensive descriptions of the key academic topics and concepts that apply to their question.

Student Context:
- Name: ${studentProfile.firstName || 'Student'}
- Grade: ${studentProfile.grade || 'Not specified'}
- Interests: ${interests || 'Not specified'}

For each of the 5 descriptions, you should:
1. Identify a specific academic subject area or interdisciplinary field
2. Explain the key concepts and principles that apply to the student's question
3. Describe how these concepts would be utilized to solve or understand the student's goal
4. Make connections to the student's interests when relevant
5. Ensure descriptions are detailed enough for semantic search (100-150 words each)

Response Format:
PRIMARY_TOPIC: [Main academic subject/field]
PRIMARY_CATEGORY: [Category like STEM, Humanities, Social Sciences, etc.]

DESCRIPTION_1: [First detailed academic analysis]
DESCRIPTION_2: [Second detailed academic analysis]
DESCRIPTION_3: [Third detailed academic analysis]
DESCRIPTION_4: [Fourth detailed academic analysis]
DESCRIPTION_5: [Fifth detailed academic analysis]

Make each description substantive and specific to enable effective vector search against academic content.`;
  }

  private buildUserPrompt(question: string): string {
    return `Please analyze this student question and provide 5 intelligent academic topic descriptions:

Student Question: "${question}"

Provide 5 comprehensive descriptions of the academic subjects, topics, and concepts that would help answer this question, following the format specified in your system instructions.`;
  }

  private parseResponse(response: string): AcademicAnalysis {
    try {
      const lines = response.split('\n').filter(line => line.trim());
      
      let primaryTopic = '';
      let primaryCategory = '';
      const descriptions: string[] = [];

      for (const line of lines) {
        if (line.startsWith('PRIMARY_TOPIC:')) {
          primaryTopic = line.replace('PRIMARY_TOPIC:', '').trim();
        } else if (line.startsWith('PRIMARY_CATEGORY:')) {
          primaryCategory = line.replace('PRIMARY_CATEGORY:', '').trim();
        } else if (line.match(/^DESCRIPTION_\d+:/)) {
          const description = line.replace(/^DESCRIPTION_\d+:/, '').trim();
          if (description) {
            descriptions.push(description);
          }
        }
      }

      // Fallback: if parsing fails, extract descriptions differently
      if (descriptions.length === 0) {
        const descriptionMatches = response.match(/DESCRIPTION_\d+:\s*(.+?)(?=DESCRIPTION_\d+:|$)/gs);
        if (descriptionMatches) {
          descriptions.push(...descriptionMatches.map(match => 
            match.replace(/^DESCRIPTION_\d+:\s*/, '').trim()
          ));
        }
      }

      if (descriptions.length < 5) {
        console.warn(`Only ${descriptions.length} descriptions parsed from OpenAI response`);
      }

      return {
        descriptions: descriptions.slice(0, 5), // Ensure exactly 5 descriptions
        primaryTopic: primaryTopic || 'General Academic Inquiry',
        primaryCategory: primaryCategory || 'Interdisciplinary'
      };

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse academic analysis response');
    }
  }
}