import type { Story } from '../types'

/*
 * STAND-IN TEXT.
 * backend/samples/new_student.txt was not present when Phase 1 was built, so
 * this is placeholder prose written around the three required marked
 * sentences. Replace the sentences below with the sample file's text, keeping
 * numeric IDs sequential across the whole story and the three feeling markers.
 */
export const newStudent: Story = {
  id: 'new-student',
  title: 'The New Student',
  category: 'School',
  readMinutes: 4,
  sections: [
    {
      id: 's1',
      sentences: [
        {
          id: 1,
          text: 'Maya stepped off the bus and stood very still on the pavement, holding both straps of her backpack.',
          marker: { type: 'feeling' },
        },
        { id: 2, text: 'The school was larger than the one she had left behind in the spring.' },
        {
          id: 3,
          text: 'Groups of students walked past her, talking and laughing as if they had known each other forever.',
        },
        { id: 4, text: "Maya's heart beat quickly.", marker: { type: 'feeling' } },
      ],
    },
    {
      id: 's2',
      sentences: [
        { id: 5, text: 'Inside, a teacher named Mr. Okafor showed her to Room 12.' },
        {
          id: 6,
          text: 'He told the class that Maya had just moved from another city, and everyone turned to look.',
        },
        { id: 7, text: 'Then she looked down at her shoes.', marker: { type: 'feeling' } },
        { id: 8, text: 'A girl near the window moved her bag off the empty chair beside her.' },
      ],
    },
    {
      id: 's3',
      sentences: [
        { id: 9, text: '"You can sit here if you like," the girl said. "I\'m Priya."' },
        {
          id: 10,
          text: 'Maya sat down and placed her pencil case carefully in the centre of the desk.',
        },
        {
          id: 11,
          text: 'When the lesson began, Priya slid her notes across so Maya could see where they were up to.',
        },
        { id: 12, text: 'By lunchtime, Maya had stopped counting the minutes until the bell.' },
      ],
    },
  ],
}
