import type { ContentItem, PortfolioContent } from "@/lib/types";

const item = (id: string, content: Partial<ContentItem>): ContentItem => ({
  id, slug: id, title: "", summary: "", featured: false, published: true,
  tags: [], highlights: [], media: [], links: [], sections: [], ...content,
});

// Initial facts come from ../details.md. Unclear dates and missing information
// stay blank. Planned work is explicitly distinguished from completed work.
export const defaultContent: PortfolioContent = {
  settings: { siteTitle: "Prachi Sharma | AI & Machine Learning", siteDescription: "Prachi Sharma's portfolio: computer vision, multimodal AI, image restoration, and multi-agent reinforcement learning.", accent: "#95caff" },
  profile: {
    name: "Prachi Sharma", shortName: "Prachi Sharma", role: "AI / ML · Computer Vision · Research",
    eyebrow: "Artificial intelligence & machine learning",
    heroTitle: "Exploring intelligence.\nBuilding understanding.",
    introduction: "I'm Prachi, a final-year Computer Science student at Amity University, Noida. I explore how machines perceive, understand, and learn — through computer vision, multimodal AI, and research-driven experimentation.",
    location: "", email: "", phone: "", availability: "", avatarUrl: "", logoUrl: "", resumeUrl: "", resumeUpdatedAt: "", socials: [],
  },
  about: {
    heading: "A curiosity for how intelligence works.",
    paragraphs: [
      "I'm a final-year B.Tech student in Computer Science and Engineering at Amity University, Noida, specializing in Artificial Intelligence and Machine Learning. I'm pursuing an AI/ML honours track, with Generative AI as an elective.",
      "At Tech Mahindra MakersLab, I gained practical experience with Indic-language datasets, computer vision, traffic analytics, and AI pipeline integration. Through Amity's PRISM research internship, I explored how vision-language models can guide image dehazing.",
      "My projects connect visual perception, language, and learning: from video scene understanding with local LLMs to multi-agent reinforcement learning for traffic signal control. I enjoy experimenting with architectures, studying model behaviour, and understanding the decisions behind a working system.",
      "I want to pursue a master's degree in AI/ML to deepen my theoretical understanding, strengthen my research capabilities, and investigate more challenging problems in artificial intelligence.",
    ],
    principles: ["Research-led problem solving", "Learning through experimentation", "Connecting models and systems", "Evaluating with evidence"],
    interests: ["Computer vision", "Multimodal learning", "Vision-language models", "Reinforcement learning"],
  },
  skills: [
    { id: "vision", title: "Computer vision", description: "From detecting objects to understanding scenes and restoring images.", skills: ["OpenCV", "YOLO", "ByteTrack", "OCR & ANPR", "Image dehazing", "Scene graphs"] },
    { id: "multimodal", title: "Language & multimodal AI", description: "Exploring the connections between visual representations and language.", skills: ["CLIP", "Transformers", "Large language models", "Ollama", "Generative AI", "Cross-attention"] },
    { id: "learning", title: "Learning & experimentation", description: "Model training, comparative experiments, and adaptive systems.", skills: ["PyTorch", "Deep learning", "Multi-agent RL", "MAPPO", "SUMO & TraCI", "Ablation studies"] },
    { id: "engineering", title: "AI engineering", description: "Preparing data and connecting models into practical pipelines.", skills: ["Python", "Java", "Dataset engineering", "ONNX", "APIs", "Git", "JSON"] },
  ],
  projects: [
    item("multimodal-video-understanding", {
      title: "Multimodal video scene understanding", category: "Computer vision / Multimodal AI", featured: true,
      summary: "Connecting object detection, tracking, scene graphs, and a local language model to query video in natural language.",
      description: "A video understanding pipeline that converts visual observations into structured scene representations and supports natural-language questions through a locally deployed language model.",
      tags: ["ByteTrack", "Scene graphs", "Ollama", "Computer vision"],
      highlights: ["Multi-object tracking across video frames", "Structured scene representations with JSON", "Natural-language queries through a local LLM"],
      sections: [
        { id: "pipeline", title: "From frames to structured understanding", body: "The system detects objects in video frames, maintains their identities using ByteTrack, and represents entities and their relationships through scene graphs. Structured JSON output connects the perception pipeline to the language-model component." },
        { id: "querying", title: "Asking questions about video", body: "A locally deployed language model, accessed through Ollama, answers natural-language questions about the structured video content." },
        { id: "evaluation", title: "Reported experimental results", body: "The supplied project notes report mAP of 0.86, MOTA of 0.83, motion accuracy of 91%, F1 of 0.88, processing speed of 15 FPS, and query accuracy of 92%. These are project-reported figures; the evaluation dataset and experimental setup are not specified in the notes." },
      ],
    }),
    item("vision-language-image-dehazing", {
      title: "Vision-LLM guided image dehazing", category: "Research / Image restoration", featured: true, organization: "PRISM · Amity University", date: "2026",
      summary: "Investigating how CLIP semantic representations can guide a U-Net to restore images affected by atmospheric haze.",
      description: "Research undertaken through the PRISM 2026 Winter Batch, exploring semantic guidance for image restoration.",
      tags: ["CLIP", "U-Net", "Cross-attention", "Image restoration"],
      highlights: ["Vision Transformer embeddings for semantic representations", "Cross-attention for feature integration", "Pixel-level, perceptual, and semantic training objectives"],
      sections: [
        { id: "question", title: "Can semantics help restore an image?", body: "This investigation asks whether semantic information from vision-language models can improve the restoration of images degraded by atmospheric haze, beyond pixel-level reconstruction." },
        { id: "architecture", title: "Connecting CLIP and U-Net", body: "The approach combines a U-Net image restoration architecture with CLIP vision-transformer embeddings. Cross-attention integrates semantic guidance, while hybrid loss functions combine L1, perceptual, and semantic objectives." },
        { id: "experiments", title: "Understanding each contribution", body: "Ablation experiments investigate the contribution of individual architecture components and training objectives." },
      ],
    }),
    item("resilient-traffic-control", {
      title: "Adaptive traffic control with multi-agent RL", category: "Research / Reinforcement learning", featured: true, status: "In development",
      summary: "Studying how learning agents can coordinate urban traffic signals and respond to changing conditions and disruptions.",
      description: "Adaptive Multi-Agent Reinforcement Learning for Resilient Urban Traffic Signal Control is a semester project with a staged implementation and research plan.",
      tags: ["MAPPO", "SUMO", "PyTorch", "Multi-agent RL"],
      highlights: ["SUMO traffic environments and TraCI control", "Centralized training with decentralized execution", "Resilience-aware reward design"],
      sections: [
        { id: "scope", title: "Learning to coordinate intersections", body: "The minor-project scope covers SUMO simulation, MAPPO with centralized training and decentralized execution, resilience-aware rewards, and disruption scenarios. Work includes environment setup, observation vectors, reward calculations, and training experiments." },
        { id: "evaluation", title: "Evaluating resilience", body: "The evaluation plan compares fixed-time, actuated, and baseline reinforcement-learning controllers using delay, queue length, throughput, travel time, and recovery following disruptions." },
        { id: "future", title: "Planned extensions", body: "Graph Neural Networks or Graph Attention Networks for intersection coordination, GRU/LSTM traffic prediction, and larger-scale resilience evaluation are planned major-project extensions." },
      ],
    }),
    item("ai-financial-wellbeing", {
      title: "AI-enabled financial well-being", category: "Applied AI / Hackathon exploration", status: "Exploratory work",
      summary: "Exploring AI-assisted loan-health analysis, financial planning, and safer digital banking for a Punjab & Sind Bank hackathon.",
      description: "A proposed web-based Progressive Web App focused on financial well-being and customer-facing AI workflows.",
      tags: ["CatBoost", "Synthetic data", "PWA", "Applied AI"],
      highlights: ["Loan-health analysis and financial scenarios", "Cyber-fraud awareness and risk assessment", "English, Hindi, and Punjabi interaction explored"],
      sections: [
        { id: "idea", title: "Helping customers understand financial risk", body: "The exploration covers financial guidance, loan-health analysis, scenario simulation, allocation recommendations, and customer-service assistance. These describe the proposed scope, rather than a claim that every feature is implemented." },
        { id: "data", title: "Experimenting with synthetic data", body: "The project notes describe a loan-health pipeline involving approximately 2,000 synthetic customers, 1.15 million transactions, and 104,000 loan records. These are synthetic datasets. CatBoost, Temporal Fusion Transformer modelling, and AI-driven risk logic were explored as technical components." },
      ],
    }),
  ],
  papers: [], certificates: [], events: [], updates: [],
  education: [item("amity-btech", { title: "B.Tech · Computer Science & Engineering", organization: "Amity University, Noida", startDate: "August 2023", endDate: "April 2027 (expected)", summary: "Specialization in Artificial Intelligence and Machine Learning. AI/ML honours track and Generative AI elective. CGPA: 8.73/10.", status: "Final year", tags: ["AI/ML", "Generative AI"] })],
  experience: [
    item("tech-mahindra", { title: "AI/ML Intern", organization: "Tech Mahindra MakersLab", location: "Pune, India", summary: "Worked on Indic-language dataset cleaning, deduplication and validation; YOLO-based traffic analytics, tracking, ANPR and OCR; and AI pipeline integration.", highlights: ["Explored ONNX optimization and AI automation", "Contributed to a QR-related Virtual Try-On backend enhancement"], tags: ["Python", "YOLO", "OpenCV", "ONNX"] }),
    item("prism-research", { title: "AI Research Intern", organization: "PRISM · Amity University", startDate: "January 2026", endDate: "June 2026", summary: "Investigated vision-language-model-guided image dehazing with U-Net, CLIP embeddings, cross-attention, and hybrid training objectives.", tags: ["CLIP", "U-Net", "Cross-attention", "Ablation studies"] }),
  ],
  club: { enabled: false, name: "", role: "", summary: "", description: "", media: [], links: [] },
};
