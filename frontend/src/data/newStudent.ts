import type { Story } from '../types'

// Text from backend/samples/new_student.txt, split with backend/text_utils.split_sentences.
// Sentence ids are the backend's 0-based indices across the whole story; do not renumber.
export const newStudent: Story = {
  id: 'new-student',
  title: 'The New Student',
  category: 'School',
  readMinutes: 1,
  sections: [
    {
      id: 's1',
      sentences: [
        {
          id: 0,
          text: 'Maya stepped off the bus and held the strap of her backpack a little tighter.',
          marker: { type: 'feeling' },
        },
        { id: 1, text: 'It was her first day at a new school, and everything felt unfamiliar.' },
        {
          id: 2,
          text: 'The building looked bigger than her old school, and the hallways were full of students she had never met.',
        },
      ],
    },
    {
      id: 's2',
      sentences: [
        { id: 3, text: 'In homeroom, the teacher smiled and asked Maya to introduce herself.' },
        { id: 4, text: "Maya's heart beat quickly.", marker: { type: 'feeling' } },
        { id: 5, text: 'She gave a small smile and said, "Hi, I\'m Maya."' },
        { id: 6, text: 'Then she looked down at her shoes.', marker: { type: 'feeling' } },
      ],
    },
    {
      id: 's3',
      sentences: [
        { id: 7, text: 'After class, a girl with a kind smile walked up to her.' },
        { id: 8, text: '"Hi, I\'m Leah," she said.' },
        { id: 9, text: '"I\'m new here too.' },
        { id: 10, text: 'Want to sit together at lunch?"' },
        { id: 11, text: 'Maya felt a little more relaxed.' },
        { id: 12, text: "Maybe this new school wouldn't be so scary after all." },
      ],
    },
  ],
}
