"use client"

import { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

import { Course } from '../Coursework';

interface CourseProps {
  course: Course;
}

export default function CourseBlock({ course }: CourseProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = ()=> {
    setIsFlipped(prev => !prev)
  }

  return (
    <div onClick={handleClick} className='w-full h-16 md:h-15 clickable'>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div key="front" className='h-16 md:h-15 flex flex-col p-2 border-b border-gray-100 items-start gap-1'>
              <h5 className='leading-tight max-md:text-sm font-normal'>&gt; {course.number} <span className='text-black'>{course.name}</span></h5>
              <ol className='list-none  pl-2 flex flex-row gap-1 items-center pb-0.5'>
                  {course.languages.map((skill, index) => (
                      <li key={index} className='shadow-inner p-0.5 px-1.5 text-sm rounded-lg'>{skill}</li>
                  ))}
              </ol>
            </div>

            <div key="back" className='w-full h-16 md:h-15 flex flex-col p-1.5 text-sm sm:text-base'>
            <p className='leading-tight text-gray-500'>{course.date}: {course.description}</p>
            </div>
        </ReactCardFlip>
    </div>
  );
}
