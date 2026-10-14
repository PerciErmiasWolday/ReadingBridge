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
        {
          id: 0,
          text: 'Omar had worked on his volcano for three weeks.',
        },
        {
          id: 1,
          text: 'He had built the cone out of clay and painted the sides brown and green.',
        },
        {
          id: 2,
          text: 'On the morning of the science fair, he carried it carefully into the gym.',
        },
        {
          id: 3,
          text: 'His older sister walked beside him with the poster.',
        },
        {
          id: 4,
          text: 'Through the windows, he could see long tables covered with projects about plants, magnets and rockets.',
        },
        {
          id: 5,
          text: 'At the door, she patted his shoulder and said, "Break a leg."',
          marker: {
            type: 'idiom',
          },
        },
        {
          id: 6,
          text: 'Omar nodded and went inside.',
        },
      ],
      quiz: {
        question: "What did Omar's sister mean when she said “Break a leg”?",
        options: ['Good luck.', 'Be careful not to fall.', 'Go back home.'],
        answerIndex: 0,
        evidenceSentenceId: 5,
        why: '“Break a leg” is a saying that means “good luck”. She said it as he went in to show his project.',
      },
    },
    {
      id: 's2',
      sentences: [
        {
          id: 7,
          text: 'He set the volcano on his table and poured in the vinegar.',
        },
        {
          id: 8,
          text: 'Nothing happened.',
        },
        {
          id: 9,
          text: 'The red liquid sat in the cone and did not bubble at all.',
        },
        {
          id: 10,
          text: 'Omar stared at it and waited.',
        },
        {
          id: 11,
          text: 'A boy at the next table looked over and raised his eyebrows.',
        },
        {
          id: 12,
          text: '"Oh, great," Omar said, frowning at the table.',
          marker: {
            type: 'feeling',
          },
        },
        {
          id: 13,
          text: 'The judges were only three tables away.',
        },
      ],
      quiz: {
        question: 'When Omar said “Oh, great,” how did he probably feel?',
        options: ['Happy', 'Annoyed', 'Sleepy'],
        answerIndex: 1,
        evidenceSentenceId: 12,
        why: 'He was frowning, and his volcano did not work. Here “Oh, great” means the opposite of its words.',
      },
    },
    {
      id: 's3',
      sentences: [
        {
          id: 14,
          text: 'Then he noticed the baking soda was still in his bag.',
        },
        {
          id: 15,
          text: 'He added it, and the volcano finally foamed over the sides.',
          marker: {
            type: 'why',
          },
        },
        {
          id: 16,
          text: 'Red bubbles ran down onto the tray he had brought.',
        },
        {
          id: 17,
          text: 'A judge wrote something on her clipboard and smiled.',
        },
        {
          id: 18,
          text: 'Omar let out a long breath.',
        },
        {
          id: 19,
          text: 'When she moved on, he wiped the edge of the tray with a paper towel.',
        },
      ],
      quiz: {
        question: 'Why did the volcano finally foam over the sides?',
        options: [
          'The judge stirred the mixture.',
          'Omar shook the table hard.',
          'Omar added the baking soda.',
        ],
        answerIndex: 2,
        evidenceSentenceId: 14,
        why: 'The baking soda was still in his bag, not in the volcano. The volcano foamed only after he added it.',
      },
    },
  ],
}
