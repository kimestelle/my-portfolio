"use client";

import { useState } from "react";

const categories = [
  {
    name: "Handmade",
    link: "https://photos.app.goo.gl/NBK9J7WmrS9NoxKx9",
  },
  {
    name: "Pics",
    link: "https://photos.app.goo.gl/R226D7cDwiE2MY7e7",
  },
//   {
//     name: "Music",
//     link: "https://drive.google.com/drive/folders/YOUR_MUSIC_ALBUM_ID",
//   },
];

const Creative = () => {
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  return (
    <div className="relative bg-red-solid flex flex-col gap-5 p-10 md:px-20">
      <div className="flex flex-col gap-3 items-start">
        <h5>I&apos;m not an artist but I like pretty things</h5>
        <div className="flex flex-row gap-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Creative;