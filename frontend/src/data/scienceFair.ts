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
    },
    {
      id: 's3',
      sentences: [
        { id: 9, text: 'Then he noticed the baking soda was still in his bag.' },
        { id: 10, text: 'He added it, and the volcano finally foamed over the sides.' },
        { id: 11, text: 'A judge wrote something on her clipboard and smiled.' },
      ],
    },
  ],
}
