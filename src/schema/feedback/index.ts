export type QualitativeFeedbackItem = {
  author: {
    username: string;
    avatar: string;
    platform: 'twitter' | 'reddit';
    link?: string;
  };
  hashtags: string[];
  content: string;
  date: string;
  comments: number;
  likes: number;
  reposts: number;
};

export const feedbackData: QualitativeFeedbackItem[] = [
  {
    author: {
      username: 'SusOrangeCat',
      avatar: '/ambassadors/james-briggs.jpeg',
      platform: 'reddit',
    },
    hashtags: ['#mistrallarge2'],
    content: 'Mistral large 2 has been my go to model.',
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'Snowball',
      avatar: '/ambassadors/sam-witteveen.png',
      platform: 'twitter',
    },
    hashtags: ['#pixtral'],
    content: 'Pixtral absolutely SLAYS at OCR.',
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'Mistral_Fan',
      avatar: '/ambassadors/chansung-park.png',
      platform: 'reddit',
    },
    hashtags: ['#pixtral'],
    content:
      'Very impressive at charts and diagrams and drawings and photos of screens.',
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'TiramisuFeline',
      avatar: '/ambassadors/priyanka-madiraju.jpg',
      platform: 'twitter',
    },
    hashtags: ['#mistralnemo'],
    content:
      'Mistral Nemo is impressive. With 12B parameters and 128k context length, it performs remarkably well. I\'ve compared it to Llama-2-13B and the results are outstanding. The model handles complex reasoning tasks with ease and the instruction following capabilities are top-notch.',
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'Venus',
      avatar: '/ambassadors/matthew-berman.jpg',
      platform: 'reddit',
    },
    hashtags: ['#mistrallarge'],
    content:
      "This model is so good. In terms of local models, this is probably the first that I honestly felt was proprietary tier for coding.",
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'Rebelspy',
      avatar: '/ambassadors/alexey-shabanov.jpg',
      platform: 'twitter',
    },
    hashtags: ['#mistralnemo'],
    content:
      'Nemo\'s coherence and creativity are exceptional. I\'ve tested it against various Llama 3 8B fine-tunes and it consistently outperforms them. The instruction capabilities are particularly strong, making it ideal for complex tasks that require nuanced understanding.',
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
  {
    author: {
      username: 'Tramontana',
      avatar: '/ambassadors/eric-jacopin.png',
      platform: 'reddit',
    },
    hashtags: ['#pixtral'],
    content: "It outperforms GPT-4o-mini in many examples I've tested.",
    date: '2025-07-01',
    comments: 2,
    likes: 10,
    reposts: 5,
  },
];

