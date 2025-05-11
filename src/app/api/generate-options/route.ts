import { NextResponse } from 'next/server';

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

async function generateDistractorsWithDeepSeek(question: string, correctAnswer: string): Promise<string[]> {
  if (!DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is not configured.');
    throw new Error('AI features are currently unavailable.');
  }

  const prompt = `Question: "${question}"
Correct Answer: "${correctAnswer}"

Generate 3 distinct, plausible but incorrect distractor answer options for this quiz question.
Return ONLY a valid JSON array of strings containing the three distractors, without any other text, explanations, or markdown. For example: ["Distractor 1", "Distractor 2", "Distractor 3"]

JSON Array of Distractors:`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: 'You are an assistant that generates quiz distractors.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 150, // Adjust as needed
        stream: false, // We want the full response for JSON parsing
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`DeepSeek API error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch distractors from AI. Status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('DeepSeek response did not contain expected content structure:', data);
      throw new Error('AI returned an unexpected response format.');
    }

    // Try to extract the JSON array from the content
    // The model might sometimes add a bit of extra text or markdown around the JSON.
    const jsonMatch = content.match(/\[([\s\S]*?)\]/);
    if (jsonMatch && jsonMatch[0]) {
      try {
        const parsedDistractors = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsedDistractors) && parsedDistractors.every(item => typeof item === 'string') && parsedDistractors.length > 0) {
          return parsedDistractors.slice(0, 3); // Ensure we only take up to 3 distractors
        }
      } catch (e) {
        console.error('Failed to parse JSON from DeepSeek response:', content, e);
        // Fallthrough to try cleaning
      }
    }
    
    // Fallback: if direct JSON parsing fails, try to clean and parse known patterns
    // This is a more brittle approach, ideally the model sticks to the JSON_ONLY instruction
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.substring(7);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
    }
    cleanedContent = cleanedContent.trim();

    try {
      const parsedDistractors = JSON.parse(cleanedContent);
      if (Array.isArray(parsedDistractors) && parsedDistractors.every(item => typeof item === 'string') && parsedDistractors.length > 0) {
        return parsedDistractors.slice(0, 3);
      }
      throw new Error('Parsed content is not a valid distractor array.');
    } catch (e) {
      console.error('Failed to parse cleaned JSON from DeepSeek response:', cleanedContent, e);
      throw new Error('AI returned distractors in an unparsable format.');
    }

  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    // Re-throw or handle as appropriate, e.g., return mock data as fallback
    if (error instanceof Error && error.message.startsWith('AI features are currently unavailable.')) throw error;
    throw new Error('An error occurred while generating AI options.');
  }
}

export async function POST(request: Request) {
  try {
    const { question, correctAnswer } = await request.json();

    if (!question || typeof question !== 'string' || !correctAnswer || typeof correctAnswer !== 'string') {
      return NextResponse.json({ error: 'Question and correctAnswer are required and must be strings.' }, { status: 400 });
    }

    let distractors: string[];
    try {
      distractors = await generateDistractorsWithDeepSeek(question, correctAnswer);
      if (distractors.length === 0) {
        // Fallback if AI returns empty array but no error
        throw new Error('AI returned no distractors.');
      }
    } catch (aiError: any) {
      console.warn('AI distractor generation failed, falling back to mock options:', aiError.message);
      // Fallback to mocked distractors if DeepSeek fails
      distractors = [
        `Simulierte falsche Option A für Frage: "${question.substring(0, 20)}..."`,
        `Vielleicht nicht '${correctAnswer}', sondern Option B?`,
        `Eine ganz andere Mock-Option C`,
      ];
    }
    
    // Ensure we always have exactly 3 distractors for consistent UI
    while (distractors.length < 3) {
        distractors.push(`Zusätzliche Mock-Option ${distractors.length + 1}`);
    }
    distractors = distractors.slice(0, 3);

    const allOptions = [correctAnswer, ...distractors];
    const shuffledOptions = shuffleArray(allOptions);

    // Simulate a delay, as a real API call would take time
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

    return NextResponse.json({ options: shuffledOptions }, { status: 200 });
  } catch (error) {
    console.error('Error in generate-options API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
