import type { Story } from '../types'

// Split with backend/text_utils.split_sentences. Sentence ids are the backend's 0-based
// indices across the whole story; do not renumber.
export const twoFriends: Story = {
  id: 'two-friends',
  title: 'Two Friends at the Park',
  description: 'Priya and Jess spend an afternoon at the park.',
  category: 'Friendship',
  readMinutes: 1,
  sections: [
    {
      id: 's1',
      sentences: [
        { id: 0, text: 'Priya and Jess met at the park after school.' },
        { id: 1, text: 'Priya brought a frisbee, and Jess brought a bag of oranges.' },
        { id: 2, text: 'They found a flat patch of grass near the pond.' },
      ],
    },
    {
      id: 's2',
      sentences: [
        { id: 3, text: 'Jess threw the frisbee too hard, and it landed in a tree.' },
        { id: 4, text: 'Priya laughed and climbed up to get it.' },
        { id: 5, text: 'When she came down, her knee was scraped.', marker: { type: 'who' } },
        { id: 6, text: 'Jess gave her a tissue from the bag.' },
      ],
    },
    {
      id: 's3',
      sentences: [
        { id: 7, text: 'They sat by the pond and shared the oranges.' },
        { id: 8, text: 'The frisbee stayed on the grass for the rest of the afternoon.' },
      ],
    },
  ],
}
