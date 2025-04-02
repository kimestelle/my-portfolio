"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";

interface TimelineItemProps {
  date: string;
  description: string;
  bulletPoints: string[];
  imageUrls: string[];
  iconType: "lightbulb" | "target"; // Determines which SVG icon to display
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  description,
  bulletPoints,
  imageUrls,
  iconType,
}) => {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="relative flex flex-col md:flex-row items-start gap-2">
      {/* Icon and Date */}
      <div className="flex flex-row items-center md:w-20">
        <span className="font-sans-serif red">{date}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-lg font-quincy">{description}</p>
        <ul className="mt-2 ml-4 list-disc list-outside">
          {bulletPoints.map((point, index) => (
            <li key={index} className="text-gray-700 font-sans-serif">
              {point.includes("Penn Spark") ? (
                <>
                  <a
                    href="https://www.pennspark.org"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Penn Spark
                  </a>{" "}
                  {point.replace("Penn Spark", "")}
                </>
              ) : point.includes("Daily Pennsylvanian") ? (
                <>
                  <a
                    href="https://www.thedp.com"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Daily Pennsylvanian
                  </a>{" "}
                  {point.replace("Daily Pennsylvanian", "")}
                </>
              ) : point.includes("California Legislation") ? (
                <>
                  <a
                    href="https://leginfo.legislature.ca.gov"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    California Legislation
                  </a>{" "}
                  {point.replace("California Legislation", "")}
                </>
              ) : (
                point
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const timelineItems: TimelineItemProps[] = [
    {
      date: "2025~",
      description: "Interactive Museum Experience Project @ Penn Spark",
      bulletPoints: [
        "Developer on an immersive, gamified web app for a 9-month exhibition in collaboration with the Penn Museum.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2025~",
      description: "Web Developer @ UPenn Autonomous Systems Lab",
      bulletPoints: [
        "Migrate an HTML website used across 20+ countries to React framework, focused on improving UX and maintainability.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2025~",
      description: "Web Developer @ Children's Hospital of Philadelphia Autism Research Center",
      bulletPoints: [
        "On student team developing an online research hub bridging an ML backend/extensive database with information-forward web interface.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2024",
      description: "Mobile App Project @ Penn Spark",
      bulletPoints: [
        "Co-lead a team of designers + developers to build social exploration app that helps Penn students spontaneously discover events and communities on campus.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2024",
      description: "Summer Internship @ FlexIt",
      bulletPoints: [
        "Worked at late-stage tech startup alongside founders, team members, and MBA interns.",
        "Focused on communicating and seeking feedback to deliver quality work, including drafting the Q4 stakeholder report and implementing new ideas like a language filter on the search page and trainer business cards.",
      ],
      imageUrls: ["/images/flexit-internship.jpg"],
      iconType: "lightbulb",
    },
    {
      date: "2023~",
      description: "Wharton Investment & Trading Group",
      bulletPoints: [
        "Learned valuation and accounting fundamentals through semester-long accelerator program in Penn’s premier finance club.",
        "Explored finance by taking thorough notes on books, external pitch competitions + internal activities, and upperclassman mentorship.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2023-2024",
      description: "Daily Pennsylvanian Foundation",
      bulletPoints: [
        "Contributed to shaping the new Foundation branch of Penn’s independent newspaper with the exec director.",
        "Connected with alumni, designed an 8-page capital campaign handbook, and engaged with key figures in Philly’s media ecosystem.",
      ],
      imageUrls: ["/images/daily-pennsylvanian.jpg"],
      iconType: "lightbulb",
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
      imageUrls: ["/images/california-legislation.jpg"],
      iconType: "lightbulb",
    }
  ];

  return (
    <div id='experience' className="timeline-container mt-10 px-6 md:px-32 py-10">
      <div className='flex flex-row items-center  w-full mb-10'>
        <h2 className='pl-5'>Experience | Resume</h2>
        <a className='p-2' href='EUNYUL_KIM_2027.pdf'>
          <img src='icons/download.svg' className='h-6'/>
        </a>
      </div>
      <div className="relative">
        {timelineItems.map((item, index) => (
          <div key={index} className="mb-6 pl-8">
            <TimelineItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
