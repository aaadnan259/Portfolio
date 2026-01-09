import { Briefcase, GraduationCap } from "lucide-react";
import { ExperienceItem, ProjectItem, SkillGroup } from "@/types";

export const experiences: ExperienceItem[] = [
    {
        title: "Software Engineering Intern",
        company: "Code Echo",
        location: "Toledo, OH",
        date: "July 2024 – Present",
        description: [
            "Architected Python-based microservices and REST APIs, optimizing workflows for 50+ daily active users.",
            "Reduced operational tasks by ~30% through AI-augmented automation.",
            "Ensured zero-downtime migrations for critical business operations.",
            "Designed, developed, and deployed responsive websites for local businesses using React, JavaScript, HTML, and CSS.",
            "Contributed to the design, coding, testing, and debugging of software applications using Java, Python, and C, reducing bug reports by 15%."
        ],
        icon: Briefcase,
        logo: "/images/codeecho.webp",
    },
    {
        title: "Bachelor of Science (B.S.) Computer Science Engineering Technology",
        company: "University of Toledo",
        location: "Toledo, OH",
        date: "Graduated: December 2025",
        description: [
            "GPA: 3.3; College of Engineering Dean's List",
            "Activities: Alpha Lambda Mu President, Alpha Lambda Mu Secretary, P.E.A.C.E. Project Mentor",
            "Relevant Coursework: Object Oriented Programming, Algorithms, Computer Networks, Operating Systems, Senior Technology Capstone"
        ],
        icon: GraduationCap,
        logo: "/images/utoledo.webp",
    },
];

export const projects: ProjectItem[] = [
    {
        title: "EchoBot",
        subtitle: "AI Voice Powered Virtual Assistant",
        description: "Architected a real-time AI microservice and Top-K RAG pipeline using Google Gemini's 1M+ token context. Achieved <200ms latency handling 100+ concurrent sessions.",
        tags: ["Python", "Generative AI", "RAG", "FastAPI", "ChromaDB"],
        links: { demo: "#", github: "https://github.com/aaadnan259/EchoBot" },
        image: "/images/echobot-demo.jpg",
    },
    {
        title: "GraphRAG Engine",
        subtitle: "Hybrid Knowledge Graph Retrieval",
        description: "Designed a hybrid retrieval engine using Neo4j and ChromaDB to merge vector search with graph traversal. Implemented async ingestion with Gemini, optimizing entity extraction throughput.",
        tags: ["Python", "Neo4j", "LangChain", "RAG", "ChromaDB"],
        links: { demo: "#", github: "#" },
        image: "/images/graphrag.jpg",
    },
    {
        title: "IntelliStock",
        subtitle: "AI Powered Inventory Management System",
        description: "Developed a Linear Regression forecasting engine (accuracy 65%→85%) and scalable data pipeline. Optimized database performance to reduce query overhead by ~98%.",
        tags: ["Python", "Django", "React", "PostgreSQL", "Scikit-learn"],
        links: { demo: "#", github: "#" },
        image: "/images/intellistock.jpg",
    },
    {
        title: "Generative Metaball Engine",
        subtitle: "Real-Time Fluid Visuals",
        description: "Senior Design Capstone Award Winner. Achieved ~100x performance speedup using NumPy vectorization and multithreading for real-time 24/7 autonomous operation.",
        tags: ["Python", "NumPy", "Raspberry Pi", "OpenCV", "Computer Vision"],
        links: { demo: "#", github: "https://github.com/aaadnan259/Generative-AI-Artwork" },
        image: "/images/metaball.jpg",
        video: "/videos/generative-art-demo.mp4?v=2",
    }
];

export const skills: SkillGroup[] = [
    {
        category: "Languages",
        items: [
            { name: "Python", icon: "devicon-python-plain" },
            { name: "Java", icon: "devicon-java-plain" },
            { name: "JavaScript", icon: "devicon-javascript-plain" },
            { name: "C", icon: "devicon-c-plain" },
            { name: "HTML/CSS", icon: "devicon-html5-plain" },
            { name: "SQL", icon: "devicon-postgresql-plain" }
        ]
    },
    {
        category: "Frameworks & Libraries",
        items: [
            { name: "React", icon: "devicon-react-original" },
            { name: "Next.js", icon: "devicon-nextjs-plain" },
            { name: "Django", icon: "devicon-django-plain" },
            { name: "Pandas", icon: "devicon-pandas-plain" },
            { name: "Scikit-learn", icon: "devicon-scikitlearn-plain" },
            { name: "Tailwind CSS", icon: "devicon-tailwindcss-original" }
        ]
    },
    {
        category: "Tools & Platforms",
        items: [
            { name: "Git & GitHub", icon: "devicon-github-original" },
            { name: "Jira", icon: "devicon-jira-plain" },
            { name: "AWS", icon: "devicon-amazonwebservices-original" },
            { name: "VS Code", icon: "devicon-vscode-plain" },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain" }
        ]
    },
    {
        category: "Concepts",
        items: [
            { name: "RESTful APIs", icon: "devicon-networkx-plain" },
            { name: "Machine Learning", icon: "devicon-tensorflow-original" },
            { name: "NLP", icon: "devicon-python-plain" },
            { name: "Data Analytics", icon: "devicon-pandas-plain" },
            { name: "Agile/Scrum", icon: "devicon-jira-plain" },
            { name: "OOP", icon: "devicon-java-plain" }
        ]
    }
];
