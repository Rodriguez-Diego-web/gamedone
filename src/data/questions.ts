
import type { Question } from '@/types';

export const DUMMY_QUESTIONS: Question[] = [
  {
    id: 'q_fav_color',
    text: (name) => `What is ${name}'s absolute favorite color?`,
    answerPlaceholder: 'e.g., Cerulean Blue, Forest Green',
  },
  {
    id: 'q_dream_job',
    text: (name) => `If ${name} could have any job in the world, what would it be?`,
    answerPlaceholder: 'e.g., Astronaut, Pastry Chef',
  },
  {
    id: 'q_hidden_talent',
    text: (name) => `What's a surprising hidden talent ${name} possesses?`,
    answerPlaceholder: 'e.g., Juggling, Whistling with crackers',
  },
  {
    id: 'q_spirit_animal',
    text: (name) => `What does ${name} consider their spirit animal?`,
    answerPlaceholder: 'e.g., Wise Owl, Playful Otter',
  },
  {
    id: 'q_first_concert',
    text: (name) => `What was the first concert ${name} ever attended?`,
    answerPlaceholder: 'e.g., The Wiggles, A local band',
  },
  {
    id: 'q_ideal_breakfast',
    text: (name) => `Describe ${name}'s ideal breakfast.`,
    answerPlaceholder: 'e.g., Pancakes with maple syrup, Avocado toast',
  },
  {
    id: 'q_embarrassing_moment',
    text: (name) => `What's a funny embarrassing moment ${name} might share?`,
    answerPlaceholder: 'e.g., Tripped on stage, Wore mismatched shoes',
  },
  {
    id: 'q_fav_book_genre',
    text: (name) => `What's ${name}'s favorite genre of books?`,
    answerPlaceholder: 'e.g., Sci-Fi, Historical Fiction',
  },
  {
    id: 'q_desert_island_item',
    text: (name) => `If ${name} were stranded on a desert island, what one *luxury* item would they bring?`,
    answerPlaceholder: 'e.g., An endless supply of chocolate, A solar-powered karaoke machine',
  },
  {
    id: 'q_go_to_snack',
    text: (name) => `What is ${name}'s ultimate go-to snack?`,
    answerPlaceholder: 'e.g., Spicy Doritos, Apple slices with peanut butter',
  },
  {
    id: 'q_fear',
    text: (name) => `What is ${name} secretly (or not so secretly) afraid of?`,
    answerPlaceholder: 'e.g., Spiders, Public speaking',
  },
  {
    id: 'q_coffee_order',
    text: (name) => `How does ${name} take their coffee or tea?`,
    answerPlaceholder: 'e.g., Black coffee, no sugar; Earl Grey with milk',
  },
];

// Helper to get a random subset of questions
export function getRandomQuestions(count: number, creatorName: string): Question[] {
  const shuffled = [...DUMMY_QUESTIONS].sort(() => 0.5 - Math.random());
  // Ensure the text function is correctly bound or invoked if needed,
  // but here text is a function that takes creatorName, so it's fine.
  return shuffled.slice(0, count);
}
