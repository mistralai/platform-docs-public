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
      username: '@mlengineer',
      avatar: '/ambassadors/james-briggs.jpeg',
      platform: 'twitter',
      link: 'https://twitter.com/mlengineer',
    },
    hashtags: ['#MistralAI', '#LLM'],
    content:
      "Just tested Mistral Large and I'm blown away by the performance. The reasoning capabilities are exceptional, especially for complex problem-solving tasks. The API is also super clean and easy to use.",
    date: '2024-01-15',
    comments: 12,
    likes: 245,
    reposts: 34,
  },
  {
    author: {
      username: 'u/ai_researcher',
      avatar: '/ambassadors/sam-witteveen.png',
      platform: 'reddit',
      link: 'https://reddit.com/user/ai_researcher',
    },
    hashtags: ['#MachineLearning', '#AI'],
    content:
      "Has anyone else noticed how fast Mistral models are? I've been using them for production workloads and the latency is significantly lower than other providers. Plus the pricing is very competitive.",
    date: '2024-02-20',
    comments: 45,
    likes: 189,
    reposts: 8,
  },
  {
    author: {
      username: '@devops_guru',
      avatar: '/ambassadors/chansung-park.png',
      platform: 'twitter',
      link: 'https://twitter.com/devops_guru',
    },
    hashtags: ['#DevOps', '#MistralAI'],
    content:
      "The function calling capabilities in Mistral are game-changing. I've integrated it into our workflow automation and it's been incredibly reliable. Highly recommend checking it out.",
    date: '2024-03-10',
    comments: 8,
    likes: 156,
    reposts: 22,
  },
  {
    author: {
      username: 'u/data_scientist',
      avatar: '/ambassadors/priyanka-madiraju.jpg',
      platform: 'reddit',
      link: 'https://reddit.com/user/data_scientist',
    },
    hashtags: ['#DataScience', '#LLM'],
    content:
      'Been using Mistral for document analysis and the results are impressive. The context window is huge and it handles long documents really well. The structured output feature is also super useful for extracting information.',
    date: '2024-04-05',
    comments: 23,
    likes: 134,
    reposts: 5,
  },
  {
    author: {
      username: '@startup_founder',
      avatar: '/ambassadors/matthew-berman.jpg',
      platform: 'twitter',
      link: 'https://twitter.com/startup_founder',
    },
    hashtags: ['#Startup', '#AI'],
    content:
      "Mistral has been a game-changer for our startup. The API is straightforward, documentation is clear, and the support team is responsive. We've been able to ship features faster thanks to their platform.",
    date: '2024-05-12',
    comments: 15,
    likes: 278,
    reposts: 41,
  },
  {
    author: {
      username: 'u/ml_enthusiast',
      avatar: '/ambassadors/alexey-shabanov.jpg',
      platform: 'reddit',
      link: 'https://reddit.com/user/ml_enthusiast',
    },
    hashtags: ['#MachineLearning', '#MistralAI'],
    content:
      "The fine-tuning capabilities are excellent. I've fine-tuned a model for our specific use case and the results exceeded expectations. The process is well-documented and the tools are intuitive.",
    date: '2024-06-18',
    comments: 31,
    likes: 167,
    reposts: 12,
  },
  {
    author: {
      username: '@tech_reviewer',
      avatar: '/ambassadors/eric-jacopin.png',
      platform: 'twitter',
      link: 'https://twitter.com/tech_reviewer',
    },
    hashtags: ['#TechReview', '#LLM'],
    content:
      "After testing multiple LLM providers, Mistral stands out for its balance of performance, speed, and cost. The quality-to-price ratio is unbeatable. Definitely worth trying if you're evaluating options.",
    date: '2024-07-22',
    comments: 19,
    likes: 312,
    reposts: 56,
  },
  {
    author: {
      username: 'u/ai_developer',
      avatar: '/ambassadors/jose-iranzo.jpg',
      platform: 'reddit',
      link: 'https://reddit.com/user/ai_developer',
    },
    hashtags: ['#Development', '#AI'],
    content:
      "The embeddings API is fantastic. I've been using it for semantic search and the quality is on par with the best providers. Integration was seamless and the pricing is very reasonable.",
    date: '2024-08-30',
    comments: 27,
    likes: 198,
    reposts: 9,
  },
];
