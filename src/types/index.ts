import { LucideIcon } from "lucide-react";

export interface ExperienceItem {
    title: string;
    company: string;
    location: string;
    date: string;
    description: string[];
    icon: LucideIcon;
    logo?: string;
}

export interface ProjectLinks {
    demo: string;
    github: string;
}

export interface ProjectItem {
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    links: ProjectLinks;
    video?: string;
}

export interface SkillItem {
    name: string;
    icon: string;
}

export interface SkillGroup {
    category: string;
    items: SkillItem[];
}
