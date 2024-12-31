import { CreativePiece } from '../Design';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'

interface CreativityBlockProps {
  piece: CreativePiece;
  onClick?: () => void;
  onClose?: () => void;
}

export default function CreativityBlock({ piece, onClick, onClose }: CreativityBlockProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
<div id="course-container" className="relative w-full h-[24rem] md:h-[32rem] flex flex-col gap-2 text-black" onClick={onClick}>
  <h3>{piece.title}</h3>
  <div className="embla">
    <div className="embla__viewport" ref={emblaRef} style={{ height: "100%" }}>
      <div className="embla__container">
        {piece.imageUrls.map((url, index) => (
          <div key={index} className="embla__slide">
            <img src={url} alt={`Creative Piece Image ${index + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
    <button className="embla__prev" onClick={scrollPrev}>&lt;</button>
    <button className="embla__next" onClick={scrollNext}>&gt;</button>
  </div>
  <h5 className="font-normal">{piece.category} | {piece.date}</h5>
  <p>{piece.description}</p>
</div>

  );
}
