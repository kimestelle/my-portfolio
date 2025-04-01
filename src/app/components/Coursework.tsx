import CourseBlock from './blocks/CourseBlock'

export interface Course {
    number: string;
    name: string;
    date: string;
    description: string;
    languages: Array<string>;
}

function buildCourse (courseObj: Course) {
    return courseObj
}

const courses = [
    buildCourse({
        number: 'CIS 5610',
        name: 'Advanced Computer Graphics',
        date: 'Spring 2025',
        description: 'Geometric transformations and algorithms, GPU pipeline, shading, raytracing, Monte Carlo path tracing, photonmapping)',
        languages: ['C++', 'GLSL']
    }),
    buildCourse({
        number: 'CIS 2400',
        name: 'Computer Systems',
        date: 'Fall 2024',
        description: 'Transistors and simple computer hardware structures, low-level programming',
        languages: ['C', 'Assembly']
    }),  
    buildCourse({
        number: 'CIS 2620',
        name: 'Automata, Computability, and Complexity',
        date: 'Spring 2024',
        description: 'Finite automata and regular languages, context-free grammars, Turing machines and undecidability, tractability, NP-completeness',
        languages: []
    }),
    buildCourse({
        number: 'CIS 1210',
        name: 'Data Structures and Algorithms',
        date: 'Spring 2024',
        description: 'Practical uses, advanced variants, runtime, and proofs for stacks, queues, maps, trees, and graphs',
        languages: ['Java'],
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