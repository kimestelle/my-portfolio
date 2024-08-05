import { CreativePiece } from '../Design';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'

interface CreativityBlockProps {
  piece: CreativePiece;
  onClick?: () => void;
  onClose?: () => void;
}

export default function CreativityBlock({ piece, onClick, onClose }: CreativityBlockProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({playOnInit: true, delay: 4000})]);

  return (
    <div id='course-container' className='relative w-full flex flex-col gap-2 p-4 sm:m-2 mt-3 shadow-inner rounded-lg text-black' onClick={onClick}>
      <button className="absolute top-2 right-2 text-xl p-2 pr-4 red" onClick={onClose}>×</button>
      <h3>{piece.title}</h3>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {piece.imageUrls.map((url, index) => (
            <div key={index} className='embla__slide h-80 object-contain'>
              <img src={url} alt={`Creative Piece Image ${index + 1}`} className='w-full h-full object-contain' />
            </div>
          ))}
        </div>
      </div>
      <h5 className='font-normal'>{piece.category} | {piece.date}</h5>
      <p>{piece.description}</p>
    </div>
  );
}
