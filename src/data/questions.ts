import type { Question } from '@/types';

export const DUMMY_QUESTIONS: Question[] = [
  // Übersetzte bestehende Fragen
  {
    id: 'q_fav_color',
    text: (name) => `Was ist ${name}s absolute Lieblingsfarbe?`,
    answerPlaceholder: 'z.B. Himmelblau, Waldgrün',
  },
  {
    id: 'q_dream_job',
    text: (name) => `Wenn ${name} jeden Job der Welt haben könnte, welcher wäre das?`,
    answerPlaceholder: 'z.B. Astronaut, Konditor',
  },
  {
    id: 'q_hidden_talent',
    text: (name) => `Welches überraschende verborgene Talent besitzt ${name}?`,
    answerPlaceholder: 'z.B. Jonglieren, Pfeifen mit Crackern im Mund',
  },
  {
    id: 'q_spirit_animal',
    text: (name) => `Was betrachtet ${name} als sein/ihr Seelentier?`,
    answerPlaceholder: 'z.B. Weise Eule, Verspielter Otter',
  },
  {
    id: 'q_first_concert',
    text: (name) => `Welches war das erste Konzert, das ${name} jemals besucht hat?`,
    answerPlaceholder: 'z.B. Die Wiggles, Eine lokale Band',
  },
  {
    id: 'q_ideal_breakfast',
    text: (name) => `Beschreibe ${name}s ideales Frühstück.`,
    answerPlaceholder: 'z.B. Pfannkuchen mit Ahornsirup, Avocado-Toast',
  },
  {
    id: 'q_embarrassing_moment',
    text: (name) => `Welchen lustigen peinlichen Moment würde ${name} vielleicht teilen?`,
    answerPlaceholder: 'z.B. Auf der Bühne gestolpert, Verschiedene Schuhe getragen',
  },
  {
    id: 'q_fav_book_genre',
    text: (name) => `Was ist ${name}s Lieblings-Buchgenre?`,
    answerPlaceholder: 'z.B. Science-Fiction, Historischer Roman',
  },
  {
    id: 'q_desert_island_item',
    text: (name) => `Wenn ${name} auf einer einsamen Insel gestrandet wäre, welchen einen *Luxusartikel* würde er/sie mitnehmen?`,
    answerPlaceholder: 'z.B. Ein endloser Vorrat Schokolade, Eine solarbetriebene Karaoke-Maschine',
  },
  {
    id: 'q_go_to_snack',
    text: (name) => `Was ist ${name}s absoluter Lieblingssnack?`,
    answerPlaceholder: 'z.B. Scharfe Doritos, Apfelscheiben mit Erdnussbutter',
  },
  {
    id: 'q_fear',
    text: (name) => `Wovor hat ${name} insgeheim (oder nicht so insgeheim) Angst?`,
    answerPlaceholder: 'z.B. Spinnen, Öffentliche Reden',
  },
  {
    id: 'q_coffee_order',
    text: (name) => `Wie trinkt ${name} seinen/ihren Kaffee oder Tee?`,
    answerPlaceholder: 'z.B. Schwarzer Kaffee, ohne Zucker; Earl Grey mit Milch',
  },

  // Neue deutsche Fragen
  {
    id: 'q_superpower',
    text: (name) => `Wenn ${name} eine Superkraft wählen könnte, welche wäre das?`,
    answerPlaceholder: 'z.B. Fliegen, Gedankenlesen',
  },
  {
    id: 'q_fav_movie_quote',
    text: (name) => `Was ist ${name}s Lieblingsfilmzitat?`,
    answerPlaceholder: 'z.B. Möge die Macht mit dir sein, Ich komme wieder',
  },
  {
    id: 'q_perfect_day_off',
    text: (name) => `Wie sieht ${name}s perfekter freier Tag aus?`,
    answerPlaceholder: 'z.B. Ausschlafen und lesen, Wandern in den Bergen',
  },
  {
    id: 'q_childhood_nickname',
    text: (name) => `Hatte ${name} als Kind einen lustigen Spitznamen?`,
    answerPlaceholder: 'z.B. Stöpsel, Wirbelwind',
  },
  {
    id: 'q_dream_vacation_spot',
    text: (name) => `Was ist ${name}s Traumreiseziel?`,
    answerPlaceholder: 'z.B. Malediven, Japan',
  },
  {
    id: 'q_unpopular_opinion',
    text: (name) => `Hat ${name} eine unpopuläre Meinung, zu der er/sie steht?`,
    answerPlaceholder: 'z.B. Ananas gehört auf Pizza, Star Wars ist überbewertet',
  },
  {
    id: 'q_karaoke_song',
    text: (name) => `Welchen Song würde ${name} beim Karaoke singen?`,
    answerPlaceholder: 'z.B. Bohemian Rhapsody, Dancing Queen',
  },
  {
    id: 'q_first_pet_name',
    text: (name) => `Wie hieß ${name}s erstes Haustier (falls vorhanden)?`,
    answerPlaceholder: 'z.B. Bello, Minka',
  },
  {
    id: 'q_something_learned_recently',
    text: (name) => `Was ist etwas Interessantes, das ${name} kürzlich gelernt hat?`,
    answerPlaceholder: 'z.B. Eine neue Sprache, Wie man Brot backt',
  },
  {
    id: 'q_fav_board_game',
    text: (name) => `Was ist ${name}s Lieblingsbrettspiel oder Kartenspiel?`,
    answerPlaceholder: 'z.B. Siedler von Catan, Uno',
  },
  {
    id: 'q_historical_figure_meeting',
    text: (name) => `Welche historische Persönlichkeit würde ${name} gerne treffen?`,
    answerPlaceholder: 'z.B. Leonardo da Vinci, Marie Curie',
  },
  {
    id: 'q_biggest_pet_peeve',
    text: (name) => `Was ist ${name}s größter "Störfaktor" (etwas, das ihn/sie wirklich nervt)?`,
    answerPlaceholder: 'z.B. Laute Kauer, Unpünktlichkeit',
  },
  {
    id: 'q_fav_season',
    text: (name) => `Welche Jahreszeit mag ${name} am liebsten und warum?`,
    answerPlaceholder: 'z.B. Sommer wegen Schwimmen, Winter wegen Schnee',
  },
  {
    id: 'q_childhood_dream',
    text: (name) => `Was war ${name}s größter Traum als Kind?`,
    answerPlaceholder: 'z.B. Feuerwehrmann werden, Prinzessin sein',
  },
  {
    id: 'q_weirdest_food_eaten',
    text: (name) => `Was ist das Seltsamste, das ${name} jemals gegessen hat?`,
    answerPlaceholder: 'z.B. Insekten, Durian-Frucht',
  },
  {
    id: 'q_morning_or_night_person',
    text: (name) => `Ist ${name} eher ein Morgenmensch oder ein Nachtmensch?`,
    answerPlaceholder: 'z.B. Definitiv Morgenmensch!, Eule der Nacht',
  },
];

// Helper to get a random subset of questions
export function getRandomQuestions(count: number, creatorName: string): Question[] {
  const shuffled = [...DUMMY_QUESTIONS].sort(() => 0.5 - Math.random());
  // Ensure the text function is correctly bound or invoked if needed,
  // but here text is a function that takes creatorName, so it's fine.
  return shuffled.slice(0, count);
}
