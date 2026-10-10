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
      quiz: {
        question: 'Who does “They” mean in “They found a flat patch of grass near the pond”?',
        options: ['Priya and Jess', 'The ducks on the pond', 'Their teachers'],
        answerIndex: 0,
        evidenceSentenceId: 0,
        why: 'The story begins with Priya and Jess meeting at the park. “They” points back to them.',
      },
    },
    {
      id: 's2',
      sentences: [
        { id: 3, text: 'Jess threw the frisbee too hard, and it landed in a tree.' },
        { id: 4, text: 'Priya laughed and climbed up to get it.' },
        { id: 5, text: 'When she came down, her knee was scraped.', marker: { type: 'who' } },
        { id: 6, text: 'Jess gave her a tissue from the bag.' },
      ],
      quiz: {
        question: 'Who came down from the tree with a scraped knee?',
        options: ['Jess', 'Priya', 'A park worker'],
        answerIndex: 1,
        evidenceSentenceId: 4,
        why: 'Priya is the one who climbed the tree. So “she” in “When she came down” means Priya.',
      },
    },
    {
      id: 's3',
      sentences: [
        { id: 7, text: 'They sat by the pond and shared the oranges.' },
        { id: 8, text: 'The frisbee stayed on the grass for the rest of the afternoon.' },
      ],
      quiz: {
        question: 'Why did the frisbee stay on the grass for the rest of the afternoon?',
        options: [
          'The frisbee was broken.',
          'It started to rain.',
          'They stopped playing and sat by the pond.',
        ],
        answerIndex: 2,
        evidenceSentenceId: 7,
        why: 'They sat by the pond and shared the oranges. They were not playing any more, so the frisbee stayed where it was.',
      },
    },
  ],
}
