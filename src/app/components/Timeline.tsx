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
      <div className="flex flex-row items-center gap-4 md:w-1/6">
        <div className="flex justify-center items-center w-6 h-6 rounded-full">
          {iconType === "lightbulb" ? (
            <img
              src="/icons/lightbulb.svg"
              alt="Lightbulb Icon"
              className="w-6 h-6"
            />
          ) : (
            <img
              src="/icons/target.svg"
              alt="Target Icon"
              className="w-6 h-6"
            />
          )}
        </div>
        <span className="text-sm font-sans-serif text-gray-500">{date}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-lg font-quincy">{description}</p>
        <ul className="mt-2 ml-4 list-disc list-outside">
          {bulletPoints.map((point, index) => (
            <li key={index} className="text-gray-700 text-sm font-sans-serif">
              {point}
            </li>
          ))}
        </ul>

        {/* Slideshow */}
        {imageUrls.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const timelineItems: TimelineItemProps[] = 
    [
        {
            date: "2022-2023",
            description: "California Legislation",
            bulletPoints: [
              "Acted as a bridge between students’ education policy proposals and actionable solutions.",
              "Worked with stakeholders, legislators, and lawyers to design sustainable legislation.",
              "Passed AB1867 (sustainable plumbing) & AB748 (mental health) in 2022 and drafted/passed SB857 (dept. of education student committee) in 2023.",
              "Lobbied for/against dozens of education bills based on student-driven stances.",
            ],
            imageUrls: ["/images/california-legislation.jpg"],
            iconType: "target",
          },
          {
      date: "2022",
      description: "CA Menstrual Equity Coalition",
      bulletPoints: [
        "Facilitated a coalition of 20+ organizations, including the ACLU, UC Student Association, and Human Rights Watch, to implement a landmark menstrual equity law across K-12 and collegiate institutions.",
        "Distributed a guide for school administrators with the CA Dept. of Education, and co-wrote a state budget request.",
        "Learned to respectfully create collaborative spaces where everyone’s expertise shines, even as the youngest member.",
      ],
      imageUrls: ["/images/cameco-coalition.jpg"],
      iconType: "lightbulb",
    },
    {
      date: "2022",
      description: "Advocacy Training Program @ CA Association of Student Councils",
      bulletPoints: [
        "Started in-person legislative advocacy trips to bridge the gap between the nonprofit’s 75-year-old legislative platform and regional students.",
        "Engaged 30-50 students in 1-on-1 conversations with legislators and staffers.",
      ],
      imageUrls: ["/images/advocacy-training.jpg"],
      iconType: "lightbulb",
    },
    {
      date: "2022",
      description: "Wharton Essentials of Innovation Summer Camp",
      bulletPoints: [
        "Ideated a venture selected as one of five to compete in a business model pitch.",
        "Led the team in developing the model and pitch deck.",
        "Explored the startup scene in SF during Wharton Essentials of Innovation Summer Camp.",
      ],
      imageUrls: ["/images/sf-adventure.jpg"],
      iconType: "target",
    },
    {
      date: "2023-2024",
      description: "Daily Pennsylvanian Foundation",
      bulletPoints: [
        "Contributed to shaping the new Foundation branch of Penn’s independent newspaper with the executive director.",
        "Connected with alumni and met my mentor.",
        "Designed an 8-page capital campaign handbook.",
        "Engaged with key figures in Philly’s media ecosystem.",
      ],
      imageUrls: ["/images/daily-pennsylvanian.jpg"],
      iconType: "lightbulb",
    },
    {
      date: "2023~",
      description: "Wharton Investment & Trading Group",
      bulletPoints: [
        "Learned valuation and accounting fundamentals through semester-long accelerator program in Penn’s premier finance club, Wharton Investment & Trading Group.",
        "Explored finance by taking thorough notes on finance books, external pitch competitions + internal activities, and upperclassman mentorship.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
    {
      date: "2024",
      description: "Summer Internship @ FlexIt",
      bulletPoints: [
        "Worked at late-stage tech startup",
        "Focused on communicating and seeking feedback to deliver quality work, including drafting the Q4 stakeholder report and implementing new ideas like a language filter on the search page and trainer business cards."
      ],
      imageUrls: ["/images/flexit-internship.jpg"],
      iconType: "target",
    },
    {
      date: "2024",
      description: "Mobile App Project @ Penn Spark",
      bulletPoints: [
        "Co-led a team of developers and designers on a social exploration app for Penn students, discovering events and communities on campus.",
        "Currently planning deployment and community partnerships.",
      ],
      imageUrls: [],
      iconType: "lightbulb",
    },
  ];

  return (
    <div className="timeline-container px-6 md:px-20 py-10">
      <div className="relative border-l-2 border-gray-300">
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
