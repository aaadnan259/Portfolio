# Adnan Ashraf - AI / Machine Learning Engineer

![Portfolio Preview](public/images/headshot.webp)

**Live Site:** [adnanashraf.dev](https://adnanashraf.dev)

## About Me

I am an AI / Machine Learning Engineer and a Computer Science graduate from the University of Toledo (December 2025). My work focuses on bridging the gap between theoretical machine learning models and production-grade software systems.

Throughout my academic and professional career, including my time as a Software Engineering Intern at Code Echo, I have specialized in building scalable backend services, RAG (Retrieval-Augmented Generation) pipelines, and Generative AI applications. I am passionate about writing clean, maintainable code and architecting systems that deliver measurable business value, from reducing operational overhead to optimizing database query performance.

## About This Project

I built this portfolio to serve as more than just a resume; it is a demonstration of my ability to engineer high-performance frontend applications. While my primary focus is backend and AI, I believe a strong engineer should understand the full stack.

### Engineering Philosophy

I designed this site with three core principles in mind:

1.  **Performance:** The site utilizes Next.js Static Exports to serve pre-rendered HTML/CSS, ensuring near-instant load times and optimal SEO without the need for a runtime server.
2.  **Type Safety:** The entire codebase is written in TypeScript, enforcing strict typing to prevent runtime errors and improve developer confidence.
3.  **User Experience:** I used Framer Motion to create smooth, purposeful animations that guide the user's attention without overwhelming the content.

## Technical Architecture

This project is a modern web application built on the React ecosystem.

### Core Stack
- **Next.js 14 (App Router):** Chosen for its robust routing, server-side capabilities, and static export support.
- **TypeScript:** Used extensively for type safety and code maintainability.
- **Tailwind CSS:** A utility-first CSS framework that allows for rapid, consistent UI development.

### Libraries & Tools
- **Framer Motion:** Powering the scroll reveals, page transitions, and interactive elements.
- **Resend:** A developer-first email API used to handle the contact form submissions serverlessly.
- **React Hook Form & Zod:** providing robust form validation and state management to ensure valid user input.
- **Lucide React:** A clean, consistent icon library.
- **GitHub Actions:** CI/CD pipeline that automatically builds and deploys the static assets to GitHub Pages on every push.

## Running Locally

If you wish to explore the code or run the site locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aaadnan259/Portfolio.git
    cd Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    To make the contact form work locally, create a `.env.local` file in the root directory and add your Resend API key:
    ```env
    RESEND_API_KEY=re_123456789
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This site is hosted on GitHub Pages. The deployment process is fully automated:
1.  Next.js is configured with `output: "export"` in `next.config.ts`.
2.  Image optimization is disabled (`unoptimized: true`) to be compatible with static hosting.
3.  A GitHub Action builds the static files and uploads the `out/` directory to the `gh-pages` environment.

## License

This project is open source and available under the [MIT License](LICENSE).
