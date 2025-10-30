export type BlogPost = {
  title: string;
  date: string;
  slug: string;
  description: string;
  category: string;
};

export const allPostsSorted: BlogPost[] = [
    // {
    //     title: "</> webGL mood ring shader",
    //     date: "2025-06-26",
    //     slug: "mood-shader",
    //     description: "version 4.0",
    // },
    {
        title: "</> into the blue",
        date: "2025-10-30",
        slug: "into-the-blue",
        description: "~ case study (coming soon) ~",
        category: 'building'
    },
    {
        title: "another portfolio update",
        date: "2025-06-26",
        slug: "new-portfolio",
        description: "version 4.0",
        category: 'building'
    },
    {
        title: "</> magnetic poetry board",
        date: "2025-06-26",
        slug: "magnet-poetry",
        description: "~ case study ~",
        category: "building"
    },
    {
        title: "on compressing thought",
        date: "2025-06-25",
        slug: "compressed-thinking",
        description: "before it means something",
        category: 'thinking'
    },
    {
        title: "litter removal",
        date: "2025-06-23",
        slug: "litter-removal",
        description: "what happens when goodness gets easier",
        category: 'thinking'
    }
];
