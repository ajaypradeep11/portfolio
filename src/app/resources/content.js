import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Pradeep",
  lastName: "M",
  legalName: "Pradeep Muthamil Selvam",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Senior Full-Stack & AI Engineer",
  avatar: "/images/avatar.png",
  location: "Canada/Eastern", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  city: "Ottawa, Ontario, Canada",
  languages: ["English", "Tamil"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <></>,
  description: (
    <>
      I write clean code. Eventually..     
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/ajaypradeep11",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/majaypradeep/",
  },
  {
    name: "Upwork",
    icon: "upwork",
    link: "https://www.upwork.com/freelancers/~013fbad03345809719",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:mpradeep11@gmail.com",
  },
];

const home = {
  label: "Home",
  title: "Ajay Pradeep Portfolio",
  description:
    "Portfolio of Ajay Pradeep, a senior full-stack and AI engineer building production SaaS, intelligent applications, and cloud platforms.",
  headline: <>Senior Full-Stack & AI Engineer</>,
  subline: (
    <>
      I build products end to end: from <InlineCode>front-end</InlineCode> and
      <InlineCode> back-end</InlineCode> architecture to <InlineCode>AI systems</InlineCode>
      and <InlineCode>cloud</InlineCode> deployment.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description:
    "Experience, technical skills, and project background for Ajay, a senior full-stack and AI engineer building SaaS, intelligent applications, and cloud platforms.",
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    nickName: "Pradeep",
    preferredName: "AJ",
    description: (
      <>
        I&apos;m a Senior Full-Stack and AI Engineer with 7+ years of experience
        building production SaaS platforms, intelligent applications, APIs,
        payment systems, and cloud infrastructure. I specialize in turning
        complex business requirements and AI capabilities into secure,
        maintainable products that work end to end.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Lando Limited",
        timeframe: "2023 - Present",
        role: "Full Stack Developer",
        achievements: [
          <>
            Improved dashboard search performance and accuracy with advanced
            Elasticsearch filters, boolean queries, wildcards, match queries,
            and script fields for complex operational data.
          </>,
          <>
            Integrated Stripe payment workflows and built scalable backend
            services with Node.js, NestJS, and tRPC.
          </>,
          <>
            Delivered full-stack product features across frontend interfaces,
            APIs, data access, and production support in a collaborative team.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        company: "ConversyAI",
        timeframe: "2025 - Present",
        role: "Head of Technology | AI & Full-Stack Engineer",
        achievements: [
          <>
            Architected a multi-tenant SaaS platform that enables businesses to
            create, train, and deploy customer-facing AI agents without code.
          </>,
          <>
            Built multi-agent orchestration, Gemini File Search knowledge bases,
            Firecrawl ingestion, Deepgram transcription, tool execution, and
            token-streaming conversation workflows.
          </>,
          <>
            Delivered the React and NestJS GraphQL platform across Firebase,
            MongoDB, and Azure, including customer intelligence, escalations,
            OAuth integrations, notifications, and embeddable chat experiences.
          </>,
        ],
        images: [],
      },
      {
        company: "The Local Ninja",
        timeframe: "2023 - Present",
        role: "Co-Founder | Software Architect & Full-Stack Engineer",
        achievements: [
          <>
            Co-founded and operate the LocalNinja anime ecommerce store while
            engineering a product portfolio spanning NinjaHR, NinjaLearn, and
            custom commerce platforms.
          </>,
          <>
            Built ecommerce and multi-tenant SaaS products with Shopify,
            Next.js, React, NestJS, PostgreSQL, Firebase, Stripe, DDD, and CQRS.
          </>,
          <>
            Designed production cloud deployments using Firebase App Hosting,
            Google Cloud Run, Cloud SQL, Supabase, and automated CI/CD pipelines.
          </>,
        ],
        images: [],
      },
      {
        company: "Infoview Technologies Private Limited",
        timeframe: "2018 - 2021",
        role: "Trainee Engineer - Development",
        achievements: [
          <>
            Collaborated with cross-functional teams to analyze, design, and develop web applications using Delphi, DWR, PostgreSQL, JavaScript, Java, and jQuery Deferred. Integrated the Japan Map API into the Commuting Cost Subsystem for payroll calculation.
          </>,
          <>
            Authored and completed the Common Setting Screen for Salary Calculation Batch Processing, utilizing DWR, Postgre, JavaScript, Java, and jQuery.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Humber International Graduate School",
        description: <>3D Modelling and VFX - (Hobbie)</>,
      },
      {
        name: "Saranathan College of Engineering",
        description: <>Bachelor&apos;s in Computer Science and Engineering</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "AI Engineering",
        description: (
          <><ul>
          <li>Multi-Agent Systems and Intent-Based Orchestration</li>
          <li>Gemini Models and Gemini File Search</li>
          <li>RAG and Knowledge-Base Ingestion</li>
          <li>AI Tool Execution and OAuth Integrations</li>
          <li>Token Streaming with Server-Sent Events</li>
          <li>Firecrawl Website Ingestion</li>
          <li>Deepgram Speech-to-Text</li>
          <li>Prompt Design, Guardrails, and Escalation Workflows</li>
        </ul></>
        ),
        images: [],
      },
      {
        title: "Front-End Development",
        description: (
          <><ul>
          <li>HTML5</li>
          <li>CSS3</li>
          <li>JavaScript (ES6+)</li>
          <li>React.js (State Management, Hooks, Component Lifecycle)</li>
          <li>Redux (State Management)</li>
          <li>TypeScript (Strongly Typed JavaScript)</li>
          <li>Next.js (Server-Side Rendering, Static Site Generation)</li>
          <li>UI/UX Design</li>
        </ul></>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [
          // {
          //   src: "/images/projects/project-01/cover-02.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
          // {
          //   src: "/images/projects/project-01/cover-03.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        title: "Backend Development",
        description: (
          <><ul>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>NestJS</li>
          <li>API Development (RESTful APIs, GraphQL)</li>
          <li>Authentication & Authorization (JWT, OAuth)</li>
          <li>Database Management (SQL, NoSQL)</li>
          <li>PostgreSQL</li>
          <li>MySQL</li>
          <li>Firebase</li>
          <li>ORMs (TypeORM)</li>
          <li>Caching (Redis)</li>
          <li>WebSocket (Real-time communication)</li>
          <li>GraphQL (Apollo)</li>
          <li>Java</li>
          <li>DWR (Direct Web Remoting)</li>
        </ul></>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [
          // {
          //   src: "/images/projects/project-01/cover-04.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        title: "DevOps & Cloud",
        description: (
          <><ul>
          <li>Docker (Containerization)</li>
          <li>Kubernetes (Container Orchestration)</li>
          <li>CI/CD (Jenkins, Bitbucket, Google Cloud)</li>
          <li>Bitbucket Pipelines (CI/CD Automation)</li>
          <li>Google Cloud (Firebase, GCP Functions, Cloud Run, Serverless functions)</li>
        </ul></>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Version Control & Collaboration",
        description: (
          <><ul>
          <li>Git (Version Control)</li>
          <li>GitHub/Bitbucket (Repository Management)</li>
          <li>Agile/Scrum (JIRA)</li>
        </ul></>
        ),
        images: [],
      },
      {
        title: "Testing",
        description: (
          <><ul>
          <li>Vite (For Testing and Build Automation)</li>
          <li>Jest (Unit Testing for JavaScript)</li>
          <li>Playwright (End-to-End Testing for JavaScript)</li>
        </ul></>
        ),
        images: [],
      },
      {
        title: "Misc",
        description: (
          <><ul>
          <li>Stripe Integration (Payment Gateway)</li>
          <li>Elasticsearch (Search Engine Optimization)</li>
          <li>Handlebars and Document Generation (DocX templater)</li>
        </ul></>
        ),
        images: [],
      }
    ],
  },
};

const blog = {
  label: "Design",
  title: "Design & 3D Work",
  description: "3D design, modeling, rendering, and creative work by Ajay.",
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Development",
  title: "Software Projects",
  description:
    "Case studies and software projects by Ajay across Next.js, NestJS, AI, cloud, and system design.",
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    // {
    //   src: "/images/gallery/img-01.jpg",
    //   alt: "image",
    //   orientation: "vertical",
    // },
    // {
    //   src: "/images/gallery/img-02.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-03.jpg",
    //   alt: "image",
    //   orientation: "vertical",
    // },
    // {
    //   src: "/images/gallery/img-04.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-05.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-06.jpg",
    //   alt: "image",
    //   orientation: "vertical",
    // },
    // {
    //   src: "/images/gallery/img-07.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-08.jpg",
    //   alt: "image",
    //   orientation: "vertical",
    // },
    // {
    //   src: "/images/gallery/img-09.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-10.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-11.jpg",
    //   alt: "image",
    //   orientation: "vertical",
    // },
    // {
    //   src: "/images/gallery/img-12.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-13.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
    // {
    //   src: "/images/gallery/img-14.jpg",
    //   alt: "image",
    //   orientation: "horizontal",
    // },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
