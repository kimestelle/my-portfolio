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
    className='w-full px-10 clickable'>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div key="front" className='w-full h-16 md:h-15 flex flex-col p-1.5 border-b border-gray-100 items-start gap-2'>
              <h3 className='leading-tight text-lg max-md:text-sm font-normal'> <span className="text-sm text-neutral-500">[{course.number}]</span> {course.name}</h3>
              <ol className='list-none flex flex-row gap-1 items-center pb-0.5'>
                  {course.languages.map((skill, index) => (
                      <li key={index} className='shadow-inner p-0.5 px-1.5 text-xs rounded-lg'>{skill}</li>
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
