export const MOCK_ARTICLES = [
  // 5 Berita Trending Utama dengan URL Unik
  { source: "AI Frontiers", title: "Project Astra: Google's Real-Time AI Assistant is Here to Challenge GPT-4o", description: "In a stunning demo, Google showcased Project Astra, a multimodal AI that sees, hears, and responds in real-time, setting a new benchmark for AI assistants.", url: "#/trending-1", image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop", publishedAt: new Date().toISOString(), topic: "Latest AI", origin: "mock-trending" },
  { source: "ML Weekly", title: "The Unseen Engine: How Foundational Models are Powering the Next Wave of AI", description: "Go beyond the hype of specific products and understand the core technology of foundational models that powers everything from chatbots to image generators.", url: "#/trending-2", image: "https://images.unsplash.com/photo-1712252431982-735a1213b194?q=80&w=2070&auto=format&fit=crop", publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), topic: "Machine Learning", origin: "mock-trending" },
  { source: "Deep Dive AI", title: "Llama 3 Explained: Why Meta's Open Source LLM is a Game Changer for Developers", description: "With its powerful performance and open-access nature, Llama 3 is enabling a new generation of developers to build sophisticated AI applications without proprietary APIs.", url: "#/trending-3", image: "https://images.unsplash.com/photo-1696274293510-99437a8b331f?q=80&w=2070&auto=format&fit=crop", publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(), topic: "LLMs", origin: "mock-trending" },
  { source: "Creative Tech", title: "Midjourney vs. Stable Diffusion 3: The Ultimate Showdown in Generative Art", description: "We put the two leading image generation models to the test with a series of creative prompts, comparing their realism, artistic interpretation, and text rendering capabilities.", url: "#/trending-4", image: "https://images.unsplash.com/photo-1685461498263-02238915c219?q=80&w=2072&auto=format&fit=crop", publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(), topic: "Generative AI", origin: "mock-trending" },
  { source: "Future Perfect", title: "Can We Trust AI? A Look into the Growing Field of AI Ethics and Regulation", description: "As AI becomes more integrated into our lives, the need for robust ethical guidelines and regulations is more critical than ever. We explore the latest discussions and proposals.", url: "#/trending-5", image: "https://images.unsplash.com/photo-1534447677768-64489b3a0e71?q=80&w=2070&auto=format&fit=crop", publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(), topic: "AI Ethics", origin: "mock-trending" },
  
  // 50 Berita Terbaru dengan URL Unik
  ...Array.from({ length: 50 }, (_, i) => {
    const topics = ["Latest AI", "Machine Learning", "LLMs", "Generative AI", "AI Ethics", "Robotics"];
    const topic = topics[i % topics.length];
    return {
      source: "MockFeed",
      title: `Exploring Advances in ${topic}: Story #${i + 1}`,
      description: `This is a detailed report on the recent developments in the field of ${topic.toLowerCase()}. We cover the latest trends and future outlooks for a variety of audiences.`,
      url: `#/latest-${i + 1}`,
      image: `https://picsum.photos/400/200?random=${i + 5}`,
      publishedAt: new Date(Date.now() - 3600000 * (13 + i)).toISOString(),
      topic: topic,
      origin: "mock",
    };
  }),
];

export const MOCK_TRENDING = MOCK_ARTICLES.slice(0, 5);