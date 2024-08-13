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
        number: 'CIS 1200',
        name: 'Programming Languages and Techniques',
        date: 'Fall 2024',
        description: 'Intro to design aspects of programming.',
        languages: ['OCaml', 'Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'CIS 1600',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'Sets, functions, permutations/ combinations, discrete probability, expectation, mathematical induction, graph theory.',
        languages: ['Java'],
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
        number: 'CIS 2620',
        name: 'Automata, Computability, and Complexity',
        date: 'Spring 2024',
        description: 'Finite automata and regular languages, context-free grammars, Turing machines and undecidability, tractability, NP-completeness',
        languages: [],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'DSGN 0010',
        name: 'Art, Design, and Digital Culture',
        date: 'Fall 2024',
        description: 'Black-and-white composition, icon design, collage making, 2d animation with Adobe Illustrator, InDesign, Photoshop, Premiere',
        languages: ['Adobe CC'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'VLST 1020',
        name: 'Visual Studies: Form and Meaning',
        date: 'Fall 2024',
        description: 'Project  & experience-based course on the theory and practice of image making',
        languages: [],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
]

export default function CourseWork() {
    return (
        <div className='flex flex-col flex-[3_3_0%] gap-5 p-10'>
            <h2 className='sm:-mb-5'>
                Coursework
            </h2>
            <div id='course-container' className='flex flex-col gap-1 sm:m-2'>
                {courses.map((course, index) => (
                    <CourseBlock key={index} course={course} />
                ))}
            </div>
            <div id='code' className='h-0'/>
        </div>
    )
}