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
        title: "</> Scavenger Hunt in the Penn Museum",
        date: "2025-10-30",
        slug: "into-the-blue",
        description: "~ Into the Blue: case study ~",
        category: 'building'
    },
    // {
    //     title: '</> watercolor drip shader',
    //     date: "2025-11-1",
    //     slug: "watercolor-shader",
    //     description: "~ case study ~",
    //     category: "building"
    // },
    {
        title: "</> magnetic poetry board",
        date: "2025-06-26",
        slug: "magnet-poetry",
        description: "~ case study ~",
        category: "building"
    },
        {
        title: "another portfolio update",
        date: "2025-06-26",
        slug: "new-portfolio",
        description: "version 4.0",
        category: 'building'
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
