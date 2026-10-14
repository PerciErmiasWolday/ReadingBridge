import type { Story } from '../types'

// Split with backend/text_utils.split_sentences. Sentence ids are the backend's 0-based
// indices across the whole story; do not renumber.
export const newStudent: Story = {
  id: 'new-student',
  title: 'The New Student',
  description: "Maya's first day at a new school.",
  category: 'School',
  readMinutes: 1,
  sections: [
    {
      id: 's1',
      sentences: [
        {
          id: 0,
          text: 'Maya stepped off the bus and held the strap of her backpack a little tighter.',
          marker: {
            type: 'feeling',
          },
        },
        {
          id: 1,
          text: 'It was her first day at a new school, and everything felt unfamiliar.',
        },
        {
          id: 2,
          text: 'The building looked bigger than her old school, and the hallways were full of students she had never met.',
        },
        {
          id: 3,
          text: 'A bell rang somewhere above her head.',
        },
        {
          id: 4,
          text: 'Groups of friends walked past, talking and laughing about their weekend.',
        },
        {
          id: 5,
          text: 'Maya checked the room number on her timetable for the third time.',
        },
        {
          id: 6,
          text: 'Then she followed the signs to homeroom.',
        },
      ],
      quiz: {
        question: 'Why did Maya hold the strap of her backpack a little tighter?',
        options: [
          'Her backpack was about to break.',
          'She felt unsure about the new school.',
          'She was cold.',
        ],
        answerIndex: 1,
        evidenceSentenceId: 1,
        why: 'It was her first day and everything felt unfamiliar. People often hold on tighter when they feel unsure.',
      },
    },
    {
      id: 's2',
      sentences: [
        {
          id: 7,
          text: 'In homeroom, the teacher smiled and asked Maya to introduce herself.',
        },
        {
          id: 8,
          text: "Maya's heart beat quickly.",
          marker: {
            type: 'feeling',
          },
        },
        {
          id: 9,
          text: 'She gave a small smile and said, "Hi, I\'m Maya."',
        },
        {
          id: 10,
          text: 'Then she looked down at her shoes.',
          marker: {
            type: 'feeling',
          },
        },
        {
          id: 11,
          text: 'The teacher thanked her and pointed to an empty desk by the window.',
        },
        {
          id: 12,
          text: 'Maya sat down and lined up her pencils in a neat row.',
        },
        {
          id: 13,
          text: 'She listened carefully for the rest of the lesson, but she did not raise her hand once.',
        },
      ],
      quiz: {
        question: 'How did Maya probably feel when she introduced herself?',
        options: ['Nervous', 'Angry', 'Bored'],
        answerIndex: 0,
        evidenceSentenceId: 10,
        why: 'She looked down at her shoes instead of at the class. People often do this when they feel nervous.',
      },
    },
    {
      id: 's3',
      sentences: [
        {
          id: 14,
          text: 'After class, a girl with a kind smile walked up to her.',
        },
        {
          id: 15,
          text: '"Hi, I\'m Leah," she said.',
        },
        {
          id: 16,
          text: '"I\'m new here too. Want to sit together at lunch?"',
        },
        {
          id: 17,
          text: 'Maya felt a little more relaxed.',
        },
        {
          id: 18,
          text: 'At lunch, they found two seats near the window.',
        },
        {
          id: 19,
          text: 'Leah told Maya which teachers were strict and which ones told funny stories.',
        },
        {
          id: 20,
          text: 'Maya laughed for the first time that day.',
        },
        {
          id: 21,
          text: "Maybe this new school wouldn't be so scary after all.",
        },
      ],
      quiz: {
        question: 'Why did Maya feel a little more relaxed?',
        options: [
          'She won a prize in class.',
          'Her old friends came to visit.',
          'Leah asked her to sit at lunch.',
        ],
        answerIndex: 2,
        evidenceSentenceId: 16,
        why: 'Leah was new too and asked Maya to lunch. Having someone to sit with made the school feel less scary.',
      },
    },
  ],
}
