/**
 * Skill icons.
 *
 * Brand logos come from react-icons (Simple Icons, Font Awesome, VS Code
 * Codicons) so they are accurate and share the same single-colour,
 * `currentColor` style. Concepts that have no brand use Lucide glyphs, which
 * the rest of the site already uses.
 */
import { FaAws, FaJava } from "react-icons/fa6";
import {
    SiC,
    SiDjango,
    SiGithub,
    SiHtml5,
    SiJavascript,
    SiJira,
    SiNextdotjs,
    SiPandas,
    SiPostgresql,
    SiPython,
    SiReact,
    SiScikitlearn,
    SiTailwindcss,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { Boxes, BrainCircuit, ChartColumn, Database, IterationCw, MessagesSquare, Webhook } from "lucide-react";

// Languages
export const PythonIcon = SiPython;
export const JavaIcon = FaJava;
export const JavaScriptIcon = SiJavascript;
export const CIcon = SiC;
export const Html5Icon = SiHtml5;
export const SqlIcon = Database;

// Frameworks & libraries
export const ReactIcon = SiReact;
export const NextJsIcon = SiNextdotjs;
export const DjangoIcon = SiDjango;
export const PandasIcon = SiPandas;
export const ScikitLearnIcon = SiScikitlearn;
export const TailwindIcon = SiTailwindcss;

// Tools & platforms
export const GithubIcon = SiGithub;
export const JiraIcon = SiJira;
export const AwsIcon = FaAws;
export const VsCodeIcon = VscVscode;
export const PostgresqlIcon = SiPostgresql;

// Concepts
export const RestApiIcon = Webhook;
export const MachineLearningIcon = BrainCircuit;
export const NlpIcon = MessagesSquare;
export const DataAnalyticsIcon = ChartColumn;
export const AgileIcon = IterationCw;
export const OopIcon = Boxes;
