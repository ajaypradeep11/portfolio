# Pradeep M - Full Stack Developer Portfolio

My personal portfolio site built with **Next.js 14**, **TypeScript**, and **Once UI**. It showcases my development projects, design work, and professional experience.

**Live site**: [ajaypradeep.com](https://ajaypradeep.com)

![Portfolio Preview](public/images/cover.png)

## About Me

Hey, I'm Pradeep (most people call me Ajay). I'm a Full Stack Developer based in Canada with 6+ years of experience building web applications from the ground up.

I work across the entire stack - designing UIs in Figma, building frontends with React/Next.js, writing backend APIs with NestJS and Node.js, and deploying everything to the cloud. I've worked with startups and small teams where wearing multiple hats is just how things go, and honestly that's the part I enjoy most.

When I'm not writing code, I dabble in 3D modelling and VFX (studied it at Humber College just for fun), and I occasionally build interactive simulators and AI-powered tools as side projects.

### Tech I Work With

**Frontend:** React, Next.js, TypeScript, Redux, Tailwind CSS, Figma

**Backend:** Node.js, NestJS, Express, GraphQL (Apollo), REST APIs, WebSockets

**Databases:** PostgreSQL, MySQL, Firebase/Firestore, MongoDB, Redis

**Cloud & DevOps:** Docker, Kubernetes, Google Cloud, Azure, CI/CD (Jenkins, Bitbucket Pipelines)

**Other:** Stripe, Elasticsearch, JWT/OAuth, TypeORM

## Featured Projects

### ConversyAI - AI Agent Platform
A multi-tenant SaaS platform where businesses can deploy custom AI agents for customer engagement. Built with React 19, NestJS 11, GraphQL, Firebase/MongoDB, and Azure. Features a multi-agent AI system, real-time streaming chat, and a no-code agent creation wizard.

### System Design Simulator
An interactive browser-based learning tool with 42 simulation modules covering distributed systems concepts. Built with React 19, TypeScript, and Vite. Includes live simulation engines, an SVG mind map, 411 interview flashcards, and failure injection testing. Over 60,000 lines of code.

### AI Interactive Story Generator
A dynamic story generation app powered by DeepSeek3 and StableAI for AI-generated narratives with illustrations. Built with Next.js and NestJS, deployed on Firebase and Google Cloud Run.

### Multi-Carrier Shipping System
A logistics platform for comparing shipping rates across carriers like Sendle, Trexity, and Loomis. Built with ReactJS (CoreUI) and NestJS.

## Getting Started

Requires **Node.js v18.17+**.

```bash
# Clone the repo
git clone https://github.com/ajaypradeep11/portfolio.git

# Install dependencies
npm install

# Start dev server
npm run dev
```

The site runs at `http://localhost:3000`.

## Project Structure

```
src/
  app/
    about/          # About page with CV and experience
    blog/posts/     # Design project write-ups (MDX)
    work/projects/  # Development project pages (MDX)
    resources/      # Site config and content
  components/       # Custom React components
  once-ui/          # Once UI design system
public/
  images/           # Project screenshots and assets
```

### Adding a New Project

Drop a new `.mdx` file in `src/app/work/projects/`. Check `_template.mdx` in that folder for the expected frontmatter format.

### Editing Content

All personal info, work experience, and skills live in `src/app/resources/content.js`. Site-wide settings (theme, routes, effects) are in `src/app/resources/config.js`.

## Built With

- [Next.js 14](https://nextjs.org) - React framework with SSR and static generation
- [Once UI](https://once-ui.com) - Design system and component library
- [MDX](https://mdxjs.com) - Markdown with JSX for content pages
- [SASS](https://sass-lang.com) - Styling
- [Sharp](https://sharp.pixelplumbing.com) - Image optimization

## Connect

- [LinkedIn](https://www.linkedin.com/in/majaypradeep/)
- [GitHub](https://github.com/ajaypradeep11)

## License

CC BY-NC 4.0 - You can share and adapt this work for non-commercial purposes with attribution. See [LICENSE](LICENSE) for details.
