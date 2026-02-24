import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Pradeep",
  lastName: "M",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Full Stack Developer",
  avatar: "/images/avatar.png",
  location: "Canada/Eastern", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
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
    link: "https://www.linkedin.com/majaypradeep",
  },
  {
    name: "Youtube",
    icon: "globe",
    link: "https://www.linkedin.com/majaypradeep",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:example@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `Ajay's Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Full Stack Developer</>,
  subline: (
    <>
      From <InlineCode>front-end</InlineCode>, <InlineCode>back-end</InlineCode> to the <InlineCode>cloud</InlineCode>, I've got it all covered.
      Oh, and did I mention? I speak <InlineCode>JavaScript</InlineCode>{" "}
      fluently.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
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
    nickName: "Ajay",
    description: (
      <>
        I'm a Full Stack developer who does it all from designing sleek
        front-end interfaces to building powerful back-end APIs, and even
        crafting cloud solutions. If it’s code, I can handle it. No challenge is
        too big, no stack too complex.
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
            Utilized Elasticsearch to optimize dashboard speed and efficiency,
            improving data retrieval performance by implementing advanced
            querying techniques such as filters, bool queries, wildcards, match
            queries, and scripts_fields to enhance search accuracy and speed.
          </>,
          <>
            Integrated Stripe for secure and seamless multi-payment
            functionality, adhering to industry standards.
          </>,
          <>
            Implemented backend solutions with Node.js, NestJS, and TRPC, ensuring scalability and reliability.
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
        company: "The Local Ninja",
        timeframe: "2023 - 2024",
        role: "Lead Developer and Operating Manager",
        achievements: [
          <>
            Developed a dashboard where I can ship orders, view invoices, integrate with Stripe, display customer details, and download invoices
          </>,
          <>
            Used React.js for the front-end with the CoreUI library and integrated Stripe for payment functionality.
          </>,
        ],
        images: [],
      },
      {
        company: "Inlustro Learning Private Limited",
        timeframe: "2021 - 2022",
        role: "Developer",
        achievements: [
          <>
            Achieved an increase in student enrolment within the first six months by developing and launching the E-Learning Platform using WordPress and Tutor LMS.
          </>,
          <>
            Utilized React.js and its concepts (Virtual DOM, JSX, and React Native) to develop study materials for the E-Learning Platform.
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
        description: <>Bachelor's in Computer Science and Engineering</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
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
          <li>UI/UX Design (Basic knowledge in Figma)</li>
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
  title: "Stuff I Made",
  description: `Design projects by ${person.name}`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Development",
  title: "My projects",
  description: `Development projects by ${person.name}`,
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
