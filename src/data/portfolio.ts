import { Briefcase, GraduationCap } from "lucide-react";
import { ExperienceItem, ProjectItem, SkillGroup } from "@/types";

export const experiences: ExperienceItem[] = [
    {
        title: "Software Developer and Project Manager Intern",
        company: "Code Echo",
        location: "Toledo, OH",
        date: "July 2024 – Present",
        description: [
            "Designed, developed, and deployed responsive websites for local businesses using React, JavaScript, HTML, and CSS.",
            "Engineered and integrated RESTful APIs to connect front-end components with back-end services.",
            "Contributed to the design, coding, testing, and debugging of software applications using Java, Python, and C, reducing bug reports by 15%.",
            "Authored comprehensive API documentation and maintained detailed internal code comments.",
            "Collaborated in an Agile environment with a distributed team, participating in daily stand-ups and sprint planning.",
            "Managed IT workspace migration for 'Toledo Recycle Services' with zero downtime.",
            "Installed and configured network-based security camera systems."
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
        title: "Generative AI Artwork",
        subtitle: "Real-Time Metaball Fluid Visuals for Raspberry Pi",
        description: "A fully-optimized generative art engine designed specifically for Raspberry Pi 4/5. Renders real-time metaball fluid visuals using NumPy-accelerated field calculations, a custom Pi-friendly render pipeline, threaded autosaving, and an optional gallery slideshow/video mode. Built for 24/7 art installations, digital galleries, senior design expos, and generative display walls.",
        tags: ["Python", "NumPy", "Raspberry Pi", "OpenCV", "Computer Vision", "Real-Time Graphics"],
        links: { demo: "#", github: "https://github.com/aaadnan259/Generative-AI-Artwork" },
        video: "/videos/generative-art-demo.mp4"
    },
    {
        title: "IntelliStock",
        subtitle: "AI Powered Inventory Management System",
        description: "Architected a full-stack inventory management application providing real-time stock tracking and data visualization. Implemented predictive ordering using scikit-learn to forecast future needs.",
        tags: ["Python", "Django", "React", "PostgreSQL", "Scikit-learn"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "EchoBot",
        subtitle: "AI Voice Powered Virtual Assistant",
        description: "Built a conversational AI assistant using NLP libraries and ElevenLabs API. Engineered the assistant to perform tasks like setting reminders and answering queries with 95% accuracy.",
        tags: ["Python", "NLP", "ElevenLabs API", "NLTK", "spaCy"],
        links: { demo: "#", github: "https://github.com/aaadnan259/EchoBot" },
        image: "/images/echobot-demo.jpg",
        imagePosition: "right"
    },
    {
        title: "Wild Wings and Things",
        subtitle: "Local Business Website",
        description: "Designed and deployed a responsive, user-friendly website for a local business, ensuring a modern digital presence.",
        tags: ["React", "JavaScript", "HTML", "CSS"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Rocky Ridge Development",
        subtitle: "Real Estate Development Site",
        description: "Developed a professional website for a development company, focusing on showcasing their portfolio and services.",
        tags: ["React", "JavaScript", "HTML", "CSS"],
        links: { demo: "#", github: "#" }
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
