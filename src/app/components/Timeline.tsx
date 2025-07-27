"use client";
import React from "react";
import Image from "next/image";

interface TimelineItemProps {
  date: string;
  description: string;
  bulletPoints: string[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  description,
  bulletPoints,
}) => {
  return (
    <div className="relative flex flex-col items-start ">
      <h3>{description} <span className="text-sm text-neutral-500">[{date}]</span></h3>

      <div className="flex-1">
        <ul className="list-disc list-inside font-sans-serif text-neutral-500">
          {bulletPoints.map((point, index) => (
            <li key={index} className="text-neutral-600">
                {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const Timeline: React.FC = () => {
  const timelineItems: TimelineItemProps[] = [
  {
    date: "2025",
    description: "Data Engineering Intern @ Southern California Edison",
    bulletPoints: [
      "Build data pipelines and manage databases for Southern California’s largest utility serving 15 million residents."
    ]
  },
  {
    date: "2025~",
    description: "Frontend Web Developer @ Children’s Hospital of Philadelphia",
    bulletPoints: [
      "Developing an ML-driven data + project management hub for autism researchers using React, Vite, and JavaScript."
    ]
  },
  {
    date: "2024~",
    description: "Vice President External, 2x Project Lead, Full-Stack Developer @ Penn Spark",
    bulletPoints: [
      "Executive board for Penn’s largest community of creative technologists and designers.",
      "Organize a top-down rebrand of the club and new community program involving alumni mentorship and corporate partnerships.",
      "2-time technical/product lead for web and app dev projects, manage cross-functional team and external partnerships."
    ]
  },
  {
    date: "2025",
    description: "Front-End Developer @ Penn Spark x Penn Museum Virtual Exhibition",
    bulletPoints: [
    "Built and maintained an interactive museum experience seen by 180K+ visitors/year under an 8-week deadline.",
    "Implemented IndexedDB architecture to persist images, metadata, and UI state for offline-first behavior.",
    "Owned webcam-to-sticker pipeline with dynamic SVG clipping, generative styling, and IndexedDB storage.",
    "Co-developed a drag-and-drop stickerboard with precise mouse/touch handling and export-to-PNG support."
    ]
  },
  {
    date: "2024",
    description: "Undergraduate Business Development & Marketing Intern @ FlexIt Inc.",
    bulletPoints: [
      "Draft Q4 stakeholder report and investor communications for late-stage startup.",
      "Propose and implement UI and marketing improvements such as improved search features and promotional cards."
    ]
  },
  {
    date: "2024~",
    description: "Industrials Committee @ Wharton Investment & Trading Group",
    bulletPoints: [
      "Applied financial modeling and business analysis skills in a semester-long training program, internal pitch debates, and the Dartmouth Stock Pitch Competition."
    ]
  },
  {
    date: "2024",
    description: "Board Member @ UPenn Women in Computer Science Residential Program",
    bulletPoints: [
      "Plan and implement tech-oriented events on campus, start a biweekly speakers program with esteemed faculty."
    ]
  },
  {
    date: "2024",
    description: "Governmental Affairs Director @ California Association of Student Councils",
    bulletPoints: [
      "Pass 3 CA laws by working with legislators, lawyers, organizations, and bureaucrats and coordinating lobbying events."
    ]
  }
];
    
  return (
    <div id='experience' >
      <div className='flex flex-row mb-5 items-center justify-start w-full'>
        <h2>Experience</h2>
        <a className='p-2' href='EUNYUL_KIM_2027.pdf' target="_blank">
          <Image src='icons/download.svg' className='h-6 w-6' width={200} height={200} alt="resume download button"/>
        </a>
      </div>
      <div>
        {timelineItems.map((item, index) => (
          <div key={index} className="mb-6">
            <TimelineItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
