"use client";

import MagnifierImage from "./components/MagnifierImage";

export default function Design() {
  return (
    <div id="design" className="flex flex-col gap-2 px-10 md:px-32 pt-12 pb-32">
      <h3 className="mb-5 mt-20">sound-to-form studies | Adobe Illustrator</h3>
      <MagnifierImage
        src="/creative-images/dsgn-0010/image-1.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        priority
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1800}
        height={900}
      />
      <h3 className="mb-5 mt-20">procedural text art | HTML canvas, d3.js</h3>
      <MagnifierImage
        src="/creative-images/textellation.png"
        alt="design icon"
        className="w-full max-w-2xl"
        zoom={3}
        radius={110}
        priority
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1000}
        height={2000}
      />
      <h3 className="mb-5 mt-20">on fast fashion | cardboard & glue</h3>
      <MagnifierImage
        src="/creative-images/cardboard-art/image-2.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1500}
        height={900}
      />
    <h3 className="mb-5 mt-20">object icons (coat) | Adobe Illustrator</h3>
    <MagnifierImage
        src="/creative-images/dsgn-0010/image-3.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1500}
        height={900}
    />
      <h3 className="mb-5 mt-20">capital campaign handbook (printed) | Adobe InDesign</h3>
    <MagnifierImage
        src="/creative-images/dp-8pager.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        priority
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1800}
        height={900}
      />
      <h3 className="mb-5 mt-20">covid-19 multimedia sculptures | cardboard, wire, masks</h3>
    <MagnifierImage
        src="/creative-images/covid-crafts.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        priority
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1800}
        height={900}
      />
      <h3 className="mb-5 mt-20">casual photos | iPhone 15</h3>

    <MagnifierImage
        src="/creative-images/photo-collage.png"
        alt="design icon"
        className="w-full"
        zoom={2.5}
        radius={110}
        priority
        sizes="(min-width: 768px) 75vw, 100vw"
        width={1800}
        height={900}
      />
    </div>

    
  );
}
