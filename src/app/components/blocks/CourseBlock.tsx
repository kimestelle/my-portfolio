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
    <div onClick={handleClick} 
    onMouseEnter={() => setIsFlipped(true)}
    onMouseLeave={() => setIsFlipped(false)}
    className='w-full clickable'>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div key="front" className='w-full h-16 md:h-15 flex flex-col py-1.5 pl-2 border-l border-neutral-200 items-start gap-2'>
              <h3 className='leading-tight max-md:text-sm font-normal'> <span className="text-sm">[{course.number}]</span> {course.name}</h3>
              <ol className='list-none flex flex-row gap-1 items-center pb-0.5'>
                  {course.languages.map((skill, index) => (
                      <li key={index} className='shadow-inner bg-white/30 p-0.5 px-1.5 text-xs rounded-lg'>{skill}</li>
                  ))}
              </ol>
            </div>

            <div key="back" className='w-full h-16 md:h-15 p-0.5 bg-white/30 flex flex-col text-sm sm:text-base'>
            <p className='leading-tight'>{course.date}: {course.description}</p>
            </div>
        </ReactCardFlip>
    </div>
  );
}
