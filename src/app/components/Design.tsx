"use client";

import MagnifierImage from "./MagnifierImage";

export default function Design() {
  return (
    <div id="design" className="flex flex-col gap-2 px-10 md:px-32 py-32">
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
      <h3 className="mb-5">sound-to-form studies | Adobe Illustrator</h3>

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
      <h3 className="mb-5">on fast fashion | cardboard & glue</h3>

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
    <h3 className="mb-5">object icons (coat) | Adobe Illustrator</h3>

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
      <h3 className="mb-5">capital campaign handbook (printed) | Adobe InDesign</h3>

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
      <h3 className="mb-5">covid-19 multimedia sculptures | cardboard, wire, masks</h3>

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
      <h3 className="mb-5">casual photos | iPhone 15</h3>

    </div>

    
  );
}
