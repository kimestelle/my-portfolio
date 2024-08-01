import { Course } from '../Coursework';

interface CourseProps {
  course: Course;
}

export default function CourseBlock({ course }: CourseProps) {
  return (
    <div className='w-full flex flex-col p-3 rounded-lg border border-gray-300'>
        <div className='flex flex-row gap-2'>
            <h4 className='leading-tight'>
                {course.number}
            </h4>
            <h5 className='leading-tight'>
                {course.name}
            </h5>
        </div>
        <img src='/dotted-line.svg' className='my-1 w-[12em]'/>
        <p>
            {course.date}: {course.description}
        </p>
        <ol className='list-none flex flex-row gap-1 mt-2'>
            {course.languages.map((skill, index) => (
                <li key={index} className='bg-gray-200 p-1 px-2 rounded-lg'>
                {skill}
                </li>
            ))}
        </ol>
    </div>
  );
}
