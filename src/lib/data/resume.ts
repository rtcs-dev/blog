import type { Resume, Experience } from "@/lib/types/resume.types";

const P5: Experience = {
  name: "Globant (formerly Pentalog)",
  startDate: new Date("January 2021"),
  endDate: new Date("January 2025"),
  position: "Fullstack web developer",
  url: "https://www.globant.com/",
  summary: [
    "A role with a lot of depth and challenges that has helped me grow a lot as a developer and a leader.",
  ],
  missions: [
    {
      name: "Leading consumer goods company",
      position: "Backend Node.js Developer",
      startDate: new Date("June 2024"),
      endDate: "present",
    },
    {
      name: "PentaStagiu Frontend",
      position: "Mentor",
      startDate: new Date("July 2023"),
      endDate: "present",
    },
    {
      name: "Startup Investment & Equity Management Platform",
      position: "Fullstack Javascript Developer",
      startDate: new Date("September 2021"),
      endDate: new Date("June 2024"),
    },
    {
      name: "SeatHere - internal app for WFO",
      position: "Frontend Developer",
      startDate: new Date("January 2021"),
      endDate: new Date("September 2021"),
    },
  ],
  highlights: [
    "Involved in the full development lifecycle for product-critical features.",
    "Developed complex user interfaces using React and many other compatible libraries.",
    "Implemented multiple REST APIs and an OAuth 2.0 server.",
    "Leveraged multiple third party providers such as OpenAI, Stripe and DocuSign.",
    "Used AWS and Terraform to deploy serverless infrastructure.",
    "Assumed ownership of initiatives and collaborated with product teams to ensure smooth delivery.",
    "Taught the basics of web development to faculty students in multiple editions of PentaStagiu.",
    "Moderated technical discussions and constantly helped keep an eye on technical debt.",
  ],
  stack: [
    {
      name: "Node",
      src: "resume/node",
    },
    {
      name: "Nest",
      src: "resume/nest",
    },
    {
      name: "React",
      src: "resume/react",
    },
    {
      name: "Next",
      src: "resume/next",
    },
    {
      name: "AWS",
      src: "resume/aws",
    },
    {
      name: "Terraform",
      src: "resume/terraform",
    },
  ],
};

const PrivateSky: Experience = {
  name: "Private Sky",
  startDate: new Date("July 2019"),
  endDate: new Date("September 2019"),
  position: "Junior Research Assistant (Intern)",
  summary: [
    "The Private Sky research project was centered around privacy & Data Sharing, blockchain, confidential smart contracts and executable choreographies.",
  ],
  highlights: [
    "Learned about Node.js, React Native and Web Components, taking my first steps into web development.",
    "Implemented proof-of-concept applications to showcase the various concepts I learned.",
  ],
  stack: [
    {
      name: "Node",
      src: "resume/node",
    },
    {
      name: "WC",
      src: "resume/wc",
    },
    {
      name: "React native",
      src: "resume/react",
    },
  ],
};

export const resume: Resume = {
  experiences: [P5, PrivateSky],
};
