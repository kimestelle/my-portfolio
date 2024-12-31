"use client";
import { useState } from 'react';
import Image from 'next/image';
import CreativityBlock from './blocks/CreativityBlock';

export interface CreativePiece {
  title: string;
  date: string;
  category: string;
  description: string;
  imageUrls: Array<string>;
  coverImage: string;
}

function buildCreativePiece(pieceObj: CreativePiece): CreativePiece {
  return pieceObj;
}

const creativePieces: CreativePiece[] = [
  buildCreativePiece({
    title: 'DSGN-0010',
    date: 'Fall 2024',
    category: 'Adobe Creative Suite',
    description: 'Projects I made while learning to use Adobe tools in my intro design class.',
    imageUrls: ['/creative-images/dsgn-0010/cover.png', '/creative-images/dsgn-0010/image-1.png', '/creative-images/dsgn-0010/image-2.png','/creative-images/dsgn-0010/image-3.png'],
    coverImage: '/creative-images/dsgn-0010/cover.png'
  }),
  buildCreativePiece({
    title: 'Futures Campaign 8-Pager',
    date: 'Fall 2024',
    category: 'Publication Design',
    description: '500 copies were printed to distribute to potential donors at campaign events.',
    imageUrls: ['/creative-images/8-pager/cover.png', '/creative-images/8-pager/image-1.png', '/creative-images/8-pager/image-2.png', '/creative-images/8-pager/image-3.png'],
    coverImage: '/creative-images/8-pager/cover.png'
  }),
  buildCreativePiece({
    title: 'Cardboard Installations',
    date: '2021-2022',
    category: 'Sculpture',
    description: '4ft tall installations I made through the pandemic with stuff from my house about mass panic over pandemic supply shortages and the final destination of fast fashion. Entered the first piece in the Scholastic Arts & Writing awards and won a regional gold medal.',
    imageUrls: [
      '/creative-images/cardboard-art/cover.png', 
      '/creative-images/cardboard-art/image-1.png', 
      '/creative-images/cardboard-art/image-2.png',
      '/creative-images/cardboard-art/image-3.png', 
      '/creative-images/cardboard-art/image-4.png', 
      '/creative-images/cardboard-art/image-5.png', 
      '/creative-images/cardboard-art/image-6.png', 
      '/creative-images/cardboard-art/image-7.png'
    ],
    coverImage: '/creative-images/cardboard-art/cover.png'
  }),
  buildCreativePiece({
    title: 'DP Foundation',
    date: '2024',
    category: 'Graphic Assets',
    description: 'Graphics I made for the Daily Pennsylvanian Foundation.',
    imageUrls: ['/creative-images/dp-designs/cover.png', '/creative-images/dp-designs/image-1.png', '/creative-images/dp-designs/image-2.png', '/creative-images/dp-designs/image-3.png'],
    coverImage: '/creative-images/dp-designs/cover.png'
  }),
];

export default function Design() {
  const [activePieceIndex, setActivePieceIndex] = useState<number | null>(null);

  const handlePieceClick = (index: number) => {
    setActivePieceIndex(index);
  };

  const handleClose = () => {
    setActivePieceIndex(null);
  };

  const goToNextPiece = () => {
    if (activePieceIndex !== null) {
      setActivePieceIndex((prevIndex) => ((prevIndex ?? 0) + 1) % creativePieces.length);
    }
  };

  const goToPreviousPiece = () => {
    if (activePieceIndex !== null) {
      setActivePieceIndex((prevIndex) =>
        prevIndex! === 0 ? creativePieces.length - 1 : prevIndex! - 1
      );
    }
  };

  return (
    <div id='design' className='relative flex flex-col gap-5 p-10 md:px-32 mt-10'>
      <div className='flex flex-row gap-3 items-center'>
        <h2>Design</h2>
        <Image src='/icons/design.svg' className='h-6 w-auto' alt='Design Icon' width={24} height={24} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {creativePieces.map((piece, index) => (
          <div
            key={index}
            className='flex flex-col p-4 shadow-inner rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300'
            onClick={() => handlePieceClick(index)}
          >
            <Image
              src={piece.coverImage}
              alt={piece.title}
              className='w-full aspect-square object-contain rounded-md mb-3'
              width={200}
              height={200}
            />
            <h3 className='text-lg font-bold'>{piece.title}</h3>
            <p className='text-sm text-gray-500'>{piece.category}</p>
          </div>
        ))}
      </div>

      {activePieceIndex !== null && (
        <div className='fixed inset-0 bg-black p-5 bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg max-w-3xl p-6 relative'>
            <button
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
              onClick={handleClose}
            >
              ✕
            </button>
            <CreativityBlock piece={creativePieces[activePieceIndex]} />
            <div className='flex justify-between mt-5'>
              <button
                className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                onClick={goToPreviousPiece}
              >
                Previous
              </button>
              <button
                className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                onClick={goToNextPiece}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}