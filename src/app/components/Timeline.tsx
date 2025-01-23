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
      <div className="flex flex-row items-center md:w-28">
        <div className="flex justify-center items-center w-6 h-6 rounded-full">
          {iconType === "lightbulb" ? (
            <img
              src="/icons/lightbulb.svg"
              alt="Lightbulb Icon"
              className="w-4 h-4 opacity-40"
            />
          ) : (
            <img
              src="/icons/target.svg"
              alt="Target Icon"
              className="w-6 h-6"
            />
          )}
        </div>
        <span className="font-sans-serif text-gray-500">{date}</span>
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

        {/* Slideshow */}
        {/* {imageUrls.length > 0 && (
          <div className="overflow-hidden mt-4" ref={emblaRef}>
            <div className="flex gap-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const timelineItems: TimelineItemProps[] = [
    {
      date: "2025",
      description: "Interactive Museum Experience Project @ Penn Spark",
      bulletPoints: [
        "Developer on an immersive, gamified web app for a 9-month exhibition in collaboration with the Penn Museum.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2024",
      description: "Mobile App Project @ Penn Spark",
      bulletPoints: [
        "Pitched an idea for a social exploration app that helps Penn students spontaneously discover events and communities on campus.",
        "Co-lead a team of designers + developers to carry out the vision, plan for app launch and community partnerships.",
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
        "Explored finance by taking thorough notes on finance books, external pitch competitions + internal activities, and upperclassman mentorship.",
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
        "Worked with stakeholders, legislators, and lawyers to design sustainable legislation, from pitching ideas to continually amending and gathering support around bills.",
        "Passed AB1867 (sustainable plumbing) & AB748 (mental health) in 2022 and drafted/passed SB857 (dept. of education student committee) in 2023.",
        "Lobbied for/against dozens of education bills based on student-driven stances.",
      ],
      imageUrls: ["/images/california-legislation.jpg"],
      iconType: "lightbulb",
    },
    {
      date: "2022",
      description: "Wharton Essentials of Innovation Summer Camp",
      bulletPoints: [
        "Ideated a venture selected as one of five to compete in a business model pitch contest.",
        "Led the team in developing the model and pitch deck, while exploring the startup scene in SF",
      ],
      imageUrls: ["/images/sf-adventure.jpg"],
      iconType: "lightbulb",
    },
    // {
    //   date: "2022",
    //   description: "Advocacy Training Program @ CA Association of Student Councils",
    //   bulletPoints: [
    //     "Started in-person legislative advocacy trips to bridge the gap between the nonprofit’s state legislative platform and regional member base.",
    //     "Designed and implemented a training program for 200 students to learn about the legislative process and how to advocate for their communities.",
    //     "Engaged 100+ total students in on-site conversations with legislators and staffers, as well as targeted lobbying activities.",
    //   ],
    //   imageUrls: ["/images/advocacy-training.jpg"],
    //   iconType: "lightbulb",
    // },
    // {
    //   date: "2022",
    //   description: "CA Menstrual Equity Coalition",
    //   bulletPoints: [
    //     "Facilitated a coalition of 20+ organizations, including the ACLU, UC Student Association, and Human Rights Watch, to implement a landmark menstrual equity law across K-12 and collegiate institutions.",
    //     "Distributed a guide for school administrators with the CA Dept. of Education, and co-wrote a state budget request.",
    //     "Learned to respectfully create collaborative spaces where everyone’s expertise shines, even as the youngest member.",
    //   ],
    //   imageUrls: ["/images/cameco-coalition.jpg"],
    //   iconType: "lightbulb",
    // },
  ];

  return (
    <div id='experience' className="timeline-container px-6 md:px-32 py-10">
      <div className='flex flex-row items-center  w-full mb-10'>
        <h2 className='pl-5'>Experience | Resume</h2>
        <a className='p-2' href='estelle-kim-resume.pdf'>
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
