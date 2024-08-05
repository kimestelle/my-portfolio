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
    <div onClick={handleClick} className='w-full h-14 sm:h-12 clickable'>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div key="front" className='w-full h-16 sm:h-12 flex sm:flex-row flex-col gap-2 p-2 border-b border-gray-100'>
                <div className='flex flex-row gap-1 items-center'>
                  <h5 className='leading-tight text-sm  font-normal'>&#8226; {course.number}</h5>
                  <p className='leading-tight text-sm'>{course.name}</p>
                </div>

            <ol className='list-none flex-row gap-1 items-center sm:pt-2 pb-0.5 hidden sm:flex'>
                {course.languages.map((skill, index) => (
                    <li key={index} className='bg-gray-200 p-0.5 px-1.5 mb-1 rounded-lg'>{skill}</li>
                ))}
            </ol>
            </div>

            <div key="back" className='w-full h-16 sm:h-12 flex flex-col p-2 text-sm sm:text-base bg-gray-100'>
            <p>{course.date}: {course.description}</p>
            </div>
        </ReactCardFlip>
    </div>
  );
}
