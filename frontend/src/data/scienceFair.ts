import type { Story } from '../types'

// Split with backend/text_utils.split_sentences. Sentence ids are the backend's 0-based
// indices across the whole story; do not renumber.
export const scienceFair: Story = {
  id: 'science-fair',
  title: 'The Science Fair',
  description: "Omar's volcano does not work the way he planned.",
  category: 'School',
  readMinutes: 1,
  sections: [
    {
      id: 's1',
      sentences: [
        { id: 0, text: 'Omar had worked on his volcano for three weeks.' },
        {
          id: 1,
          text: 'On the morning of the science fair, he carried it carefully into the gym.',
        },
        { id: 2, text: 'His older sister walked beside him with the poster.' },
        {
          id: 3,
          text: 'At the door, she patted his shoulder and said, "Break a leg."',
          marker: { type: 'idiom' },
        },
        { id: 4, text: 'Omar nodded and went inside.' },
      ],
      quiz: {
        question: "What did Omar's sister mean when she said “Break a leg”?",
        options: ['Good luck.', 'Be careful not to fall.', 'Go back home.'],
        answerIndex: 0,
        evidenceSentenceId: 3,
        why: '“Break a leg” is a saying that means “good luck”. She said it as he went in to show his project.',
      },
    },
    {
      id: 's2',
      sentences: [
        { id: 5, text: 'He set the volcano on his table and poured in the vinegar.' },
        { id: 6, text: 'Nothing happened.' },
        { id: 7, text: 'The red liquid sat in the cone and did not bubble at all.' },
        {
          id: 8,
          text: '"Oh, great," Omar said, frowning at the table.',
          marker: { type: 'feeling' },
        },
      ],
      quiz: {
        question: 'When Omar said “Oh, great,” how did he probably feel?',
        options: ['Happy', 'Annoyed', 'Sleepy'],
        answerIndex: 1,
        evidenceSentenceId: 8,
        why: 'He was frowning, and his volcano did not work. Here “Oh, great” means the opposite of its words.',
      },
    },
    {
      id: 's3',
      sentences: [
        { id: 9, text: 'Then he noticed the baking soda was still in his bag.' },
        {
          id: 10,
          text: 'He added it, and the volcano finally foamed over the sides.',
          marker: { type: 'why' },
        },
        { id: 11, text: 'A judge wrote something on her clipboard and smiled.' },
      ],
      quiz: {
        question: 'Why did the volcano finally foam over the sides?',
        options: ['The judge touched it.', 'Omar shook the table.', 'Omar added the baking soda.'],
        answerIndex: 2,
        evidenceSentenceId: 10,
        why: '“It” is the baking soda from the sentence before. The volcano foamed only after he added it.',
      },
    },
  ],
}
