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
        description: 'CIS 1200 introduces students to computer science by emphasizing the design aspects of programming.',
        languages: ['OCaml', 'Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'CIS 1600',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'sets, functions, permutations and combinations, discrete probability, expectation, mathematical Induction and graph theory',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'CIS 1210',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'sets, functions, permutations and combinations, discrete probability, expectation, mathematical Induction and graph theory',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'CIS 2620',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'sets, functions, permutations and combinations, discrete probability, expectation, mathematical Induction and graph theory',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'DSGN 0100',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'sets, functions, permutations and combinations, discrete probability, expectation, mathematical Induction and graph theory',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
    buildCourse({
        number: 'VLST 0100',
        name: 'Mathematical Foundations of Computer Science',
        date: 'Fall 2024',
        description: 'sets, functions, permutations and combinations, discrete probability, expectation, mathematical Induction and graph theory',
        languages: ['Java'],
        skills: ['Object-oriented programming', 'Functional programming', 'Programming patters', 'Abstraction']
    }),
]

export default function CourseWork() {
    return (
        <div className='flex flex-col gap-5 p-10'>
            <div className='flex flex-row gap-2'>
                <h2>
                    Coursework
                </h2>
                <div className='w-full border-b-2 border-dotted border-gray-700'/>
            </div>
            <div id='course-container' className='h-80 flex flex-col overflow-scroll gap-2 p-2 sm:m-2 shadow-inner rounded-lg'>
                {courses.map((course, index) => (
                    <CourseBlock key={index} course={course} />
                ))}
            </div>
        </div>
    )
}