"use client";
import { useState } from 'react';
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
    category: 'Coursework',
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
    title: 'Daily Pennsylvanian Foundation',
    date: '2024',
    category: 'Graphic Design',
    description: 'Graphics I made for the Daily Pennsylvanian Foundation.',
    imageUrls: ['/creative-images/dp-designs/cover.png', '/creative-images/sample-5.png', '/creative-images/sample-6.png'],
    coverImage: '/creative-images/dp-designs/cover.png'
  }),
];

export default function Design() {
  const [activePiece, setActivePiece] = useState<CreativePiece | null>(null);
  const [selectedPieces, setSelectedPieces] = useState<Set<string>>(new Set());

  const handlePieceChange = (piece: CreativePiece) => {
    setActivePiece(piece);
    setSelectedPieces(prevSelectedPieces => new Set(prevSelectedPieces).add(piece.title));
  };

  const handleClose = () => {
    setActivePiece(null);
  };

  return (
    <div className='relative flex flex-col gap-5 p-10 mt-10'>
      <div className='flex flex-row gap-3 items-center'>
        <h2>Creativity</h2>
        <img src='icons/design.svg' className='h-6'/>
        {/* <div className='w-full border-b-2 border-dotted border-gray-700' /> */}
      </div>
        {activePiece ? (
          <CreativityBlock piece={activePiece} onClose={handleClose} />
        ) : (
          <div id='creativity-container' className='w-full h-max h-[24rem] md:h-[30rem]  overflow-scroll scrollbar-hide flex flex-row justify-start items-start gap-1 md:gap-2 p-4 red-linear-gr z-1'>
            <span className='absolute red text-[1.5rem] self-start left-[2.2rem] top-[5.6rem] z-10'>&gt;</span>
            {creativePieces.map((piece, index) => (
              <img key={index} src={piece.coverImage} onClick={() => handlePieceChange(piece)} className='w-max h-[22rem] md:h-[28rem] shadow clickable'/>
            ))}
          </div>
        )}
        <div id='community' className='h-0'/>
    </div>
  );
}
