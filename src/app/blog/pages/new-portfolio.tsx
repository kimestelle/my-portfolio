import Image from "next/image";
export default function NewPortfolioPage() {
  return (
    <div className="blog-formatting responsive-padding">
      <h1 className="text-3xl font-bold">another portfolio update</h1>
      <p className="text-gray-500 mt-1 half-margin">June 25, 2025</p>
      <p className="text-gray-600 italic half-margin">version 4.0</p>
      <hr className="mb-4"/>
      <p>
        When I first started learning to code last summer, a friend suggested I build a portfolio site.
      </p>
      <p>
        “It’s a good way to get started with frontend,” he said.
      </p>
      <p>
        At the time, I remember thinking: “How can I build a portfolio if I don’t have anything to put in it?” Since then, I’ve gone through 4 versions of this site within the span of a year.
      </p>
        <label className="block mb-2">
            There was the first one, which looked like the first.
            <Image src='/blog/new-portfolio/v1-ss.png' alt="screenshot of version 1" width={600} height={400} className="rounded-lg mt-2 mb-4" />
        </label>
        <label>
            The overdone one, with a live code sandbox on the cover.
            <video src="/blog/new-portfolio/v2-video.mp4" controls className="rounded-lg mt-2 mb-4" />
        </label>
        <label>
            The underdone one, where “simple and all-purpose” flattened everything.
            <Image src='/blog/new-portfolio/v3-ss.png' alt="screenshot of version 3" width={600} height={400} className="rounded-lg mt-2 mb-4" />
        </label>
        <p>
            And now, this.
        </p>
        <p>
            Some elements stayed throughout, like the flipping cards in the coursework section and my favorite color red, but most of it changed.
        </p>
        <p>
            This one has a blog, and it focuses more on the kind of work I want to do. It’s not the most polished or universal design, but every detail means something.
        </p>
        <p>***</p>
        <p>
            I’m rarely satisfied with things I make for myself, especially design and even more so with writing.
        </p>
        <p>
            When I’m working on a project for someone else, I have a purpose, a structure, and a set of needs to meet. But when it’s just for me, I want the thing to reflect how I think and what I care about, in the most true form it can take right now.
        </p>
        <p>
            No portfolio or paragraph can fully represent a whole person, but I still find myself trying to get close.
        </p>
        <p>
            Some versions leaned into creativity, while others tried to show the kind of clarity that comes out when I’m working in a team.
        </p>
        <p>
            When junior year recruiting became real, I started thinking more deliberately about how I want to come across. I thought about where I’ve worked, where I’d do my best work, and who I’d want to work with.
        </p>
        <p>
            I reached out to people across creative tech, graphics engineering, interaction design, etc. who work in the fuzzy territory between systems and human thought. Those conversations were the best things I did this year. But because a job search moves faster than conversations, I wanted to recreate those moments of resonance through an accessible medium.
        </p>
        <p>
            I stopped thinking of this as an archive or a pitch and rather as a signal: something that might show what I am through my work and thoughts.
        </p>
        <p>***</p>
        <p>
            That led to this version. It’s not finished; there’s a lot I haven’t updated yet… The experience section is still the same, and one of the blog posts aren’t written.
        </p>
        <p>
            But weirdly, that’s why I can consistently work on it. The beauty of my site is that it’s never really done and must be deployed at some point. I also am not a polished engineer, but must show up at some point (hi). This site grows with me, in a sense.
        </p>
        <p>
            Looking back, I’m not sure if my friend meant that when he told me to build a portfolio.
        </p>
        <p>
            But it turned out to be the perfect first project anyway because it started from somewhere and kept evolving.
        </p>
        <p>
            And because it gave me a place to figure things out in motion without needing to have it all figured out.
        </p>
    </div>
  );
}
