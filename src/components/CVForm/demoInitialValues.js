import { nanoid } from 'nanoid';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';

const work1Description =
  '<ul><li>Performed general office duties and administrative tasks.</li><li>Prepared weekly confidential sales reports for presentation to management.</li><li>Managed the internal and external mail functions.</li><li>Provided telephone support.</li></ul>';
const work1BlocksFromHTML = convertFromHTML(work1Description);

const work2Description =
  '<ul><li>Administered online banking functions.</li><li>Reduced credit period from 90 days to 60 days.</li><li>Managed payroll function for 140 employees.</li><li>Monitored and recorded company expenses.</li></ul>';
const work2BlocksFromHTML = convertFromHTML(work2Description);

const demoInitialValues = {
  general: {
    avatar: null,
    firstName: 'Marco',
    lastName: 'Polo',
    email: 'marco.polo@gmail.com',
    phone: '253-631-5997',
    address: '396 Duke Lane',
    city: 'New Jersey',
    country: 'USA',
    dateOfBirth: '1975-01-01',
    gender: 'male',
    website: 'https://marcopolo.com',
  },
  objective: EditorState.createWithContent(
    ContentState.createFromText(
      'Take advantages of sales skills & experience and understanding of market to become a professional Sales Staff and bring a lot value to customers.'
    )
  ),
  education: [
    {
      id: nanoid(),
      school: 'University of Washington',
      degree: 'MS in Accounting',
      startDate: '1997-09-01',
      endDate: '2001-09-01',
      description: EditorState.createWithContent(
        ContentState.createFromText(
          'Obtained the MS degree summa cum laude, with GPA 4.0'
        )
      ),
    },
    {
      id: nanoid(),
      school: 'Columbia University',
      degree: 'BS in Accounting',
      startDate: '1993-09-01',
      endDate: '1996-09-01',
      description: EditorState.createEmpty(),
    },
    {
      id: nanoid(),
      school: 'Columbia University',
      degree: 'BS in Computer Science',
      startDate: '1989-09-01',
      endDate: '1992-09-01',
      description: EditorState.createEmpty(),
    },
  ],
  work: [
    {
      id: nanoid(),
      company: 'MyOffice Inc',
      jobTitle: 'Administrator',
      startDate: '2005-10-01',
      endDate: '',
      description: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          work1BlocksFromHTML.contentBlocks,
          work1BlocksFromHTML.entityMap
        )
      ),
    },
    {
      id: nanoid(),
      company: 'DC Systems',
      jobTitle: 'Accounting Assistant',
      startDate: '2003-03-01',
      endDate: '2005-06-01',
      description: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          work2BlocksFromHTML.contentBlocks,
          work2BlocksFromHTML.entityMap
        )
      ),
    },
  ],
  skills: [
    {
      id: nanoid(),
      skill: 'Microsoft Office',
      level: 'intermediate',
    },
    {
      id: nanoid(),
      skill: 'Windows',
      level: 'skilful',
    },
    {
      id: nanoid(),
      skill: 'Linux',
      level: 'expert',
    },
  ],
  interests: [
    {
      id: nanoid(),
      interest: 'Podcasting',
    },
    {
      id: nanoid(),
      interest: 'Writing',
    },
    {
      id: nanoid(),
      interest: 'Yoga',
    },
    {
      id: nanoid(),
      interest: 'Fishing',
    },
    {
      id: nanoid(),
      interest: 'Chess',
    },
  ],
  traits: [
    {
      id: nanoid(),
      trait: 'Honest',
    },
    {
      id: nanoid(),
      trait: 'Accountable',
    },
    {
      id: nanoid(),
      trait: 'Diligent and organized',
    },
    {
      id: nanoid(),
      trait: 'Punctual',
    },
    {
      id: nanoid(),
      trait: 'Team Player',
    },
    {
      id: nanoid(),
      trait: 'Flexible',
    },
  ],
};

export default demoInitialValues;
