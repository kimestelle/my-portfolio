export type BlogPost = {
  title: string;
  date: string;
  slug: string;
  description: string;
};

export const allPostsSorted: BlogPost[] = [
    // {
    //     title: "</> webGL mood ring shader",
    //     date: "2025-06-26",
    //     slug: "mood-shader",
    //     description: "version 4.0",
    // },
    {
        title: "another portfolio update",
        date: "2025-06-26",
        slug: "new-portfolio",
        description: "version 4.0",
    },
    {
        title: "</> magnetic poetry board",
        date: "2025-06-26",
        slug: "magnet-poetry",
        description: "wip",
    },
    {
        title: "on compressing thought",
        date: "2025-06-25",
        slug: "compressed-thinking",
        description: "before it means something",
    },
    {
        title: "litter removal",
        date: "2025-06-23",
        slug: "litter-removal",
        description: "what happens when goodness gets easier",
    }
];
