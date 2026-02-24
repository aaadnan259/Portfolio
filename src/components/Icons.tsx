/* eslint-disable @typescript-eslint/no-explicit-any */
import { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export const PythonIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M63.9 0C28.8 0 28.5 15.3 28.5 15.3l.1 16h35.7v5.1H29.1c-37.1 0-38.6 25.7-38.6 25.7S-9.2 88.6 28.2 88.6h10.9v-15c0-16.8 13.9-17 13.9-17h25.1S95.2 56 95.2 39.5c0-16.7-17-15.6-17-15.6H63.1s-4.6 1.4-4.6-5.8c0-7.2 5.1-6.1 5.1-6.1h15.2S79 .7 63.9 0zM47.7 7.9A3.8 3.8 0 1144 11.6a3.8 3.8 0 013.7-3.7zM89 39.7H78v15c0 16.8-13.9 17-13.9 17H39.1s-17.1.6-17.1 17.1c0 16.7 17 15.5 17 15.5h15.1s4.6-1.3 4.6 5.8c0 7.2-5.1 6.1-5.1 6.1H38.5s.1 11.3 35.3 11.3c35.1 0 35.4-15.3 35.4-15.3l-.1-16H73.3v-5.1H99c37.1 0 38.6-25.7 38.6-25.7S137 39.7 99 39.7zm-8.8 76.5a3.8 3.8 0 113.8-3.7 3.8 3.8 0 01-3.8 3.7z" />
    </svg>
);

export const JavaIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M85 75.9s7.4-5.2 7.4-13c0-6.1-4.7-11.2-12-14.7-6-2.9-12.7-3.6-17-4.1-13-1.6-17.9-5-17.9-10.4 0-5.4 6-9.1 12.8-9.1 8 0 16.3 3.6 21 7.2L85 19s-8.7-6.5-19.4-6.5c-15.6 0-24 9-24 20.3 0 6.6 3.6 12 11.2 16.1 6 3.3 12.4 4.5 16.3 5 12.8 1.8 17.9 6.2 17.9 12 0 6.3-5.3 10-14 10-12 0-21.7-8.1-26.6-13l-6.8 13.5S50 86 64 86c12.1 0 21-10.1 21-10.1zM64 4c0 0-4.6 1.8-6.1 7S64 22 64 22s4.9-3.4 5.2-7C69.4 12 66 10.3 64 4zM47.7 51s-4.6 2.3-5.3 7 4.1 11.8 4.1 11.8 4.9-3.9 4.3-8c-.5-3.3-3.1-4.2-3.1-10.8z" />
        <path d="M12.9 87s-2.1-4.2-1.2-7.8l-1.9-1.9s-1.8 3-2 6c-.1 3 2.5 5.5 2.5 5.5s12.5 12.7 41.6 12.7c31.1 0 49.3-15.3 49.3-15.3l-1.6-4.5s-14.7 13.9-46.3 13.9C21.7 95.6 12.9 87 12.9 87zm21.4-8S19 90.3 22 93c3.1 2.8 5 4.1 5 4.1s-1.9-1.2-4.1-3.6-4-6.2-4-8.8zm83.2.1s-7.1 6.3-14.1 9c-7.2 2.7-27.4 7-27.4 7s20.1-4.7 28.5-8.5c8.3-3.8 13-7.5 13-7.5zm-59.5 27s15.9-1.3 28.6-6l-1.3-4.4s-11.8 5-26.5 5.8c-14.7.7-28-3.1-28-3.1l-2 3.9s14.8 4.6 29.2 3.8z" />
    </svg>
);

export const JavaScriptIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M11.9 11.9h104.3v104.2H11.9z" />
        <path fill="#fff" d="M106.1 94.7c-2.4 3.7-5.5 6.6-9.1 8.6-3.7 2-8 3-12.8 3-5 0-9.3-1-12.9-3-3.6-2-6.5-5-8.6-9.1s-3.2-9-3.2-14.7v-25.1H74.3v24.8c0 4 .8 7.3 2.4 9.9 1.6 2.6 3.9 4.5 6.9 5.8 3 1.2 6.5 1.9 10.6 1.9s7.6-.6 10.6-1.9c3-1.3 5.3-3.2 6.9-5.8 1.6-2.6 2.4-5.9 2.4-9.9V54.4h14.8v25.1c0 5.8-1 10.8-3.2 15.2zm-53.7-18c-2 2.8-4.6 5-8 6.6-3.3 1.6-7.3 2.4-11.9 2.4-4.8 0-9-.8-12.5-2.5C16.5 81.5 13.6 79 11.5 76L22.6 66c3.2 5.2 7.7 7.9 13.5 7.9 2.6 0 5-.5 7.1-1.4 2.1-.9 3.2-2.3 3.2-4.2s-1-3.3-2.9-4.2c-1.9-.9-4.6-1.7-8-2.3-5-1-9.1-2-12.4-3-3.3-1.1-6.1-2.5-8.3-4.3s-3.8-4-4.7-6.5c-1-2.5-1.5-5.3-1.5-8.6 0-3.6.8-6.9 2.5-9.8S18 44 21.6 42.1c3.5-1.9 7.7-2.9 12.3-2.9 5 0 9.4.9 13.1 2.8s6.8 4.7 9.2 8.7L44.8 60c-2.2-4.1-5.7-6.2-10.4-6.2-2.3 0-4.4.5-6.3 1.4-1.9 1-2.8 2.3-2.8 4s1.1 3.2 3.2 4.1c2.1 1 5.1 1.8 9 2.6 4.6 1 8.5 2 11.7 3 3.2 1 5.9 2.3 8.3 4 2.3 1.7 4.1 3.9 5.2 6.6s1.6 5.8 1.6 9.4c0 3.5-.6 6.8-1.9 9.8z" />
    </svg>
);

export const Html5Icon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M22.8 10L14 109.8 63.8 124 114 109.8 105.1 10z" />
        <path fill="#fff" d="M37 32L35 32l6.2 68.2L63.8 106 86.6 100 85.3 85l-19.5 5.5L46 85 45 74.5l42-.2L88.9 53 43.1 53 41.5 35l49-1 1.2-13.8L37 20z" />
    </svg>
);

export const ReactIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <circle cx="64" cy="64" r="10.8" />
        <path d="M125 64c0 29-27.3 52.4-61 52.4s-61-23.4-61-52.4S30.3 11.6 64 11.6s61 23.4 61 52.4V64zm-111 0c0 23.5 19.3 42.6 43.1 42.6S102.2 87.5 102.2 64 82.9 21.4 59.1 21.4 16 40.5 16 64zm48-43c-30.8 0-55.8 19.3-55.8 43s25 43 55.8 43 55.8-19.3 55.8-43-25-43-55.8-43z" />
        <path d="M64 116.4c-25.2 0-45.6-23.5-45.6-52.4S38.8 11.6 64 11.6s45.6 23.4 45.6 52.4S89.2 116.4 64 116.4zm0-94C44 22.4 28.2 41 28.2 64S44 105.5 64 105.5 99.8 87 99.8 64 84 22.4 64 22.4v0z" />
        <path d="M116.5 89.2L12.5 38.8c-7.6-3.7-10.7-12.8-7-20.4L15.9 8.1c3.7-7.6 12.8-10.7 20.4-7L116 38.6c7.6 3.7 10.7 12.8 7 20.4l-10.4 10.3c-3.6 7.6-12.7 10.7-20.3 7zM24 22c-2.4-1.2-5.4-.1-6.6 2.3l-5.6 11.5c-1.2 2.4-.1 5.4 2.3 6.6L99.7 83.8c2.4 1.2 5.4.1 6.6-2.3l5.6-11.5c1.2-2.4.1-5.4-2.3-6.6L24 22z" />
        <path d="M12.5 89.2L116.5 38.8c7.6-3.7 10.7-12.8 7-20.4L113.1 8.1c-3.7-7.6-12.8-10.7-20.4-7L12.9 38.6c-7.6 3.7-10.7 12.8-7 20.4l10.4 10.3c3.7 7.6 12.7 10.7 20.4 7zM104 22c2.4-1.2 5.4-.1 6.6 2.3l5.6 11.5c1.2 2.4.1 5.4-2.3 6.6L28.3 83.8c-2.4 1.2-5.4.1-6.6-2.3l-5.6-11.5c-1.2-2.4-.1-5.4 2.3-6.6L104 22z" />
    </svg>
);

export const NextJsIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.2C32.4 121.2 6.8 95.6 6.8 64S32.4 6.8 64 6.8 121.2 32.4 121.2 64c0 31.6-25.6 57.2-57.2 57.2z" />
        <path d="M42.2 41.6h9.1l26.4 36.4v-36.4h8.3v44.8h-8.8L42.2 41.6v44.8h-8.3V41.6zm44.2 0h8.6l10.8 19.3 10.8-19.3h8.6l-14.7 22.8v22H102v-22z" />
    </svg>
);

// We export a generic DeveloperIcon that accepts a specific `src` prop for those we don't have SVGs for.
export const TailwindIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path d="M32 90.7c21.3-37.3 16-32 0-32v-5.3c21.3 0 21.3 0 42.7-21.3 21.3-32 16-26.7 0-26.7v-5.4c32 0 32 0 53.3-32-21.3 37.3-16 32 0 32v5.3c-21.3 0-21.3 0-42.7 21.3-21.3 32-16 26.7 0 26.7v5.4c-32 0-32 0-53.3 32z" transform="matrix(1 0 0 1 0 34.6)" />
    </svg>
);

export const GithubIcon = (props: IconProps) => (
    <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M64 5a59 59 0 00-18.7 114.9c2.9.5 4-.1 4-2.8v-10.3c-16.4 3.5-19.9-7.9-19.9-7.9-2.7-6.8-6.6-8.6-6.6-8.6-5.4-3.7.4-3.6.4-3.6 6 .4 9.1 6.1 9.1 6.1 5.3 9.1 13.9 6.5 17.3 4.9.5-3.8 2.1-6.5 3.8-8-13.1-1.5-26.9-6.5-26.9-29 0-6.4 2.3-11.6 6-15.7-.6-1.5-2.6-7.4.6-15.5 0 0 4.9-1.6 16 6a55.5 55.5 0 0129.2 0c11.1-7.6 16-6 16-6 3.2 8.1 1.2 14 .6 15.5 3.7 4.1 6 9.3 6 15.7 0 22.6-13.8 27.5-27 28.9 2.2 1.9 4.1 5.6 4.1 11.2v16.7c0 2.7 1.1 3.4 4.1 2.8A59 59 0 0064 5z" />
    </svg>
);

interface FallbackIconProps extends IconProps {
    name: string;
}

export const FallbackIcon = ({ name, ...props }: FallbackIconProps) => {
    // Simple fallback using initials or an external generic SVG logic
    return (
        <svg viewBox="0 0 128 128" width="1em" height="1em" fill="currentColor" {...props}>
            <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="8" />
            <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="40">{name[0]?.toUpperCase()}</text>
        </svg>
    );
};

export const CIcon = (props: IconProps) => <FallbackIcon name="C" {...(props as any)} />;
export const SqlIcon = (props: IconProps) => <FallbackIcon name="SQL" {...(props as any)} />;
export const DjangoIcon = (props: IconProps) => <FallbackIcon name="Django" {...(props as any)} />;
export const PandasIcon = (props: IconProps) => <FallbackIcon name="Pandas" {...(props as any)} />;
export const ScikitLearnIcon = (props: IconProps) => <FallbackIcon name="Scikit-learn" {...(props as any)} />;
export const JiraIcon = (props: IconProps) => <FallbackIcon name="Jira" {...(props as any)} />;
export const AwsIcon = (props: IconProps) => <FallbackIcon name="AWS" {...(props as any)} />;
export const VsCodeIcon = (props: IconProps) => <FallbackIcon name="VS Code" {...(props as any)} />;
export const PostgresqlIcon = (props: IconProps) => <FallbackIcon name="PostgreSQL" {...(props as any)} />;
export const RestApiIcon = (props: IconProps) => <FallbackIcon name="RESTful APIs" {...(props as any)} />;
export const MachineLearningIcon = (props: IconProps) => <FallbackIcon name="Machine Learning" {...(props as any)} />;
export const DataAnalyticsIcon = (props: IconProps) => <FallbackIcon name="Data Analytics" {...(props as any)} />;
export const AgileIcon = (props: IconProps) => <FallbackIcon name="Agile" {...(props as any)} />;
