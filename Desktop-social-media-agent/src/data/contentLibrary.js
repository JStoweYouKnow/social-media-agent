// Extracted large content library to separate module to avoid parser issues in App.js
const contentLibrary = {
  workouts: [
    {
      title: "HIIT Different: Low-Impact High Intensity",
      content: "Who said HIIT has to destroy your joints? This low-impact version gives you all the cardiovascular and metabolic benefits without the jumping and pounding. Perfect for apartment dwellers, people with joint issues, or anyone who wants effective workouts without the high impact.",
      exercises: "marching in place, arm circles, modified burpees, wall sits, resistance band exercises",
      benefits: "Burns calories, improves cardiovascular health, builds strength, joint-friendly",
      tips: "Focus on intensity through speed and resistance, not impact. Quality over quantity!"
    }
  ],
  motivational: [
    {
      title: "The 5AM Club Changed My Life (And It Might Change Yours)",
      content: "I used to be a night owl who hit snooze 6 times every morning. Then I read about the 5AM club and thought 'absolutely not.' But after trying it for 30 days, I'm never going back. The quiet hours before the world wakes up have become my sacred time for growth, planning, and peace.",
      insights: "Early mornings aren't about productivity - they're about reclaiming your power before life gets chaotic.",
      tips: "Start with 6AM, then gradually move earlier. The transition is everything.",
      impact: "Increased focus, better mood, more accomplished goals, deeper sense of control over my day."
    },
    {
      title: "Stop Waiting for Monday: The Power of Starting Now",
      content: "How many times have you said 'I'll start Monday'? I used to be the queen of Monday starts until I realized Monday never feels different than Tuesday. The magic happens when you start right now, in this imperfect moment, with whatever you have available.",
      insights: "Perfect timing is a myth. Imperfect action beats perfect inaction every single time.",
      tips: "Choose one small action you can take in the next 5 minutes. Do that instead of planning for Monday.",
      impact: "Builds momentum, creates confidence, proves to yourself that you can follow through."
    },
    {
      title: "Your Comfort Zone is Keeping You Comfortable (And Small)",
      content: "Comfort zones aren't evil - they're necessary for rest and recovery. But living there permanently? That's where dreams go to die. I spent years playing it safe until I realized that the discomfort of growth is temporary, but the regret of not trying lasts forever.",
      insights: "Growth lives in the space between 'I can't do this' and 'I did it.' That space is uncomfortable for a reason.",
      tips: "Start with micro-challenges. Say yes to one thing that scares you this week.",
      impact: "Expanded confidence, new opportunities, proof that you're capable of more than you think."
    }
  ],
  educational: [
    {
      title: "The Science of Sleep: Why Your Brain Needs 7-9 Hours",
      content: "Your brain literally cleans itself while you sleep. During deep sleep, your glymphatic system flushes out toxins and waste products that build up during the day. This includes amyloid-beta, the protein linked to Alzheimer's disease. Poor sleep isn't just about feeling tired - it's about long-term brain health.",
      science: "During sleep, brain cells shrink by 60%, creating space for cerebrospinal fluid to wash away metabolic waste.",
      tips: "Cool room (65-68°F), dark environment, no screens 1 hour before bed, consistent sleep schedule.",
      sources: "Research from University of Rochester, published in Science journal."
    },
    {
      title: "Neuroplasticity: Your Brain Can Change at Any Age",
      content: "The old belief that adult brains are fixed? Completely false. Neuroplasticity research shows that our brains continue forming new neural pathways throughout life. Every time you learn something new, practice a skill, or challenge your thinking, you're literally reshaping your brain structure.",
      science: "London taxi drivers have enlarged hippocampi from memorizing city streets. Musicians have enhanced motor cortexes.",
      tips: "Learn a new language, play an instrument, practice meditation, challenge yourself with puzzles.",
      sources: "Studies from Harvard Medical School, University College London."
    },
    {
      title: "The Gut-Brain Connection: How Your Microbiome Affects Mood",
      content: "95% of your serotonin is produced in your gut, not your brain. Your gut bacteria communicate directly with your brain via the vagus nerve, influencing mood, anxiety, and decision-making. This is why you get 'gut feelings' and why stress affects digestion.",
      science: "The gut contains 500 million neurons - more than the spinal cord. It's called the 'second brain' for good reason.",
      tips: "Eat fermented foods, reduce sugar, manage stress, include prebiotic fiber, consider probiotic supplements.",
      sources: "Research from Harvard T.H. Chan School of Public Health, Johns Hopkins Medicine."
    }
  ]
};

export default contentLibrary;
