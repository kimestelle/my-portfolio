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
    <div className="relative flex flex-col items-start gap-2">
      <h3 className="text-lg">{description} <span className="text-sm text-neutral-500">[{date}]</span></h3>

      <div className="flex-1">
        <ul className="list-disc list-inside font-sans-serif text-sm text-neutral-500">
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
      description: "Data Engineering & Systems Planning Intern @ Southern California Edison",
      bulletPoints: [

      ],
    },
    {
      date: "2025",
      description: "Technical Project Lead @ Internet Atlas (Penn Spark)",
      bulletPoints: [
        "Led team of 6 developers to iterate on and deploy an ML & ThreeJS-based website mapping users’ digital journeys as a networked force-directed graph.",
      ],
    },
    {
      date: "2025",
      description: "Front-End Dev @ Penn Museum Into The Blue Exhibition (Penn Spark)",
      bulletPoints: [
        "Developer on an immersive, gamified web app for a 9-month exhibition in collaboration with the Penn Museum.",
      ],
    },
    {
      date: "2025~",
      description: "Web Dev @ UPenn Autonomous Systems Lab",
      bulletPoints: [
        "Migrate an HTML website used across 20+ countries to React framework, focused on improving UX and maintainability.",
      ],
    },
    {
      date: "2025~",
      description: "Web Dev @ Children's Hospital of Philadelphia Autism Research Center",
      bulletPoints: [
        "On student team developing an online research hub bridging an ML backend/extensive database with information-forward web interface.",
      ],
    },
    {
      date: "2024",
      description: "Project Lead & Back-End Dev @ Penn Pins (Penn Spark)",
      bulletPoints: [
        "Co-lead a team of designers + developers to build social exploration app that helps Penn students spontaneously discover events and communities on campus.",
      ],
    },
    {
      date: "2024",
      description: "Summer Internship @ FlexIt",
      bulletPoints: [
        "Worked at late-stage tech startup alongside founders, team members, and MBA interns.",
        "Focused on communicating and seeking feedback to deliver quality work, including drafting the Q4 stakeholder report and implementing new ideas like a language filter on the search page and trainer business cards.",
      ],
    },
    {
      date: "2023~",
      description: "Wharton Investment & Trading Group",
      bulletPoints: [
        "Learned valuation and accounting fundamentals through semester-long accelerator program in Penn’s premier finance club.",
        "Explored finance by taking thorough notes on books, external pitch competitions + internal activities, and upperclassman mentorship.",
      ],
    },
    {
      date: "2023-2024",
      description: "Daily Pennsylvanian Foundation",
      bulletPoints: [
        "Contributed to shaping the new Foundation branch of Penn’s independent newspaper with the exec director.",
        "Connected with alumni, designed an 8-page capital campaign handbook, and engaged with key figures in Philly’s media ecosystem.",
      ],
    },
    {
      date: "2022-2023",
      description: "California Legislation",
      bulletPoints: [
        "Acted as a bridge between students’ education policy proposals and actionable systemic solutions.",
        "Worked with stakeholders, legislators, and lawyers to design sustainable legislation",
        "Passed AB1867 (sustainable plumbing) & AB748 (mental health) in 2022 and drafted/passed SB857 (dept. of education student committee) in 2023.",
        "Lobbied for/against dozens of education bills based on student-driven stances.",
      ],
    }
  ];

  return (
    <div id='experience' className="responsive-padding">
      <div className='flex pb-10 flex-row border-b items-center justify-center w-full mb-5'>
        <h3 className='pl-5'>Experience</h3>
        <a className='p-2' href='EUNYUL_KIM_2027.pdf' target="_blank">
          <Image src='icons/download.svg' className='h-5 w-5' width={200} height={200} alt="resume download button"/>
        </a>
      </div>
      <div className="relative px-10">
        {timelineItems.map((item, index) => (
          <div key={index} className="mb-10">
            <TimelineItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
