"use client";
import { useState, useEffect } from "react";
import { Gallery } from "react-grid-gallery";

// Define the CreativePiece interface
export interface CreativePiece {
  title: string;
  date: string;
  category: string;
  description: string;
  imageUrls: Array<string>;
  coverImage: string;
}

// Sample data for creative pieces
const creativePieces: CreativePiece[] = [
  {
    title: 'Cardboard Installations',
    date: '2021-2022',
    category: 'Physical',
    description: '4ft tall installations I made through the pandemic.',
    imageUrls: ['https://your-image-url-1.jpg', 'https://your-image-url-2.jpg'],
    coverImage: 'https://your-cover-image-url-1.jpg',
  },
  {
    title: 'Digital Artwork Series',
    date: '2020-2021',
    category: 'Digital',
    description: 'A series of abstract digital paintings.',
    imageUrls: ['https://your-image-url-3.jpg', 'https://your-image-url-4.jpg'],
    coverImage: 'https://your-cover-image-url-2.jpg',
  },
  {
    title: 'Music Video Stills',
    date: '2023',
    category: 'Music',
    description: 'Stills from music videos I directed.',
    imageUrls: ['https://your-image-url-5.jpg', 'https://your-image-url-6.jpg'],
    coverImage: 'https://your-cover-image-url-3.jpg',
  },
  {
    title: 'Photography Collection',
    date: '2022-2023',
    category: 'Photo',
    description: 'A collection of urban photography.',
    imageUrls: ['https://your-image-url-7.jpg', 'https://your-image-url-8.jpg'],
    coverImage: 'https://your-cover-image-url-4.jpg',
  },
];

function buildCreativePiece(pieceObj: CreativePiece): CreativePiece {
  return pieceObj;
}

// Shuffle function to randomize images
const shuffleArray = (array: any[]) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap
  }
  return shuffledArray;
};

const GalleryComponent = () => {
  const [filteredCategory, setFilteredCategory] = useState<string>('All');
  const [shuffledCreativePieces, setShuffledCreativePieces] = useState<CreativePiece[]>([]);

  // Shuffle the creative pieces once when the component mounts
  useEffect(() => {
    setShuffledCreativePieces(shuffleArray(creativePieces));
  }, []);

  // Handle category filtering
  const handleCategoryToggle = (category: string) => {
    setFilteredCategory(category);
  };

  // Filtered images based on selected category
  const filteredPieces = filteredCategory === 'All' 
    ? shuffledCreativePieces
    : shuffledCreativePieces.filter(piece => piece.category === filteredCategory);

  // Flatten all image URLs from the filtered pieces
  const images = filteredPieces.flatMap(piece => 
    piece.imageUrls.map(url => ({
      src: url,
      thumbnail: url,
      thumbnailWidth: 200,
      thumbnailHeight: 200,
      caption: piece.title,
      width: 600,
      height: 600
    }))
  );

  return (
    <div className='relative flex flex-col gap-5 p-10 md:px-20'>
      <div className='flex flex-col gap-3 items-start'>
        <h5>I&apos;m not an artist but I like making things</h5>
        {/* Category toggle buttons */}
            <div className='flex flex-row gap-3'>
                <button onClick={() => handleCategoryToggle('All')}>All</button>
                <button onClick={() => handleCategoryToggle('Physical')}>Physical</button>
                <button onClick={() => handleCategoryToggle('Digital')}>Digital</button>
                <button onClick={() => handleCategoryToggle('Music')}>Music</button>
                <button onClick={() => handleCategoryToggle('Photo')}>Photo</button>
            </div>

            {/* Display the gallery */}
            <Gallery images={images} />
        </div>
    </div>
  );
};

export default GalleryComponent;
