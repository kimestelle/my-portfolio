import CourseBlock from './blocks/CourseBlock'

export interface Course {
    number: string;
    name: string;
    date: string;
    description: string;
    languages: Array<string>;
    skills: Array<string>;
}

function buildCourse (courseObj: Course) {
    return courseObj
}

const courses = [
    buildCourse({
        number: 'CIS 5600',
        name: 'Interactive Computer Graphics',
        date: 'Fall 2024',
        description: '3d mesh data structures, transformation sequences, rendering algorithms',
        languages: ['C++', 'GLSL'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'CIS 2400',
        name: 'Introduction to Computer Systems',
        date: 'Fall 2024',
        description: 'Transistors and simple computer hardware structures, low-level programming',
        languages: ['C', 'Assembly'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),  
    buildCourse({
        number: 'CIS 1210',
        name: 'Data Structures and Algorithms',
        date: 'Spring 2024',
        description: 'Practical uses, advanced variants, runtime, and proofs for stacks, queues, maps, trees, and graphs',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'FNAR 2100',
        name: 'Computer Animation',
        date: 'Fall 2024',
        description: '3D modeling, rigging, animation, and rendering with Maya',
        languages: ['Maya', 'Adobe CC'],
        skills: ['Maya', 'Adobe CC']
    }),
    buildCourse({
        number: 'DSGN 0010',
        name: 'Art, Design, and Digital Culture',
        date: 'Fall 2023',
        description: 'Black-and-white composition, icon design, collage making, 2d animation with Adobe Illustrator, InDesign, Photoshop, Premiere',
        languages: ['Adobe CC'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
]

export default function CourseWork() {
    return (
        <div className='flex flex-col flex-[3_3_0%] gap-5 p-10 md:px-32 pb-0'>
            <h2 className='sm:-mb-2'>
                Coursework
            </h2>
            <div id='course-container' className='flex flex-col scrollbar-hide -gap-1 sm:m-2'>
                {courses.map((course, index) => (
                    <CourseBlock key={index} course={course} />
                ))}
            </div>
            <div id='code' className='h-0'/>
        </div>
    )
}