"use client"
import { useState } from 'react'

import ProjectBlock from './blocks/ProjectBlock'

export interface Project {
    name: string;
    date: string;
    label: string;
    languages: Array<string>;
    description: string;
}

function buildProject (projectObj: Project) {
    return projectObj
}

const courses = [
    buildProject({
        name: 'Daily Pennsylvanian Alumni Donation Page',
        date: 'Summer 2024',
        label: 'UI/UX',
        languages: ['OCaml', 'Java'],
        description: 'skhbksfkau'
    }),
]


export default function Projects() {
    const [project, setProject] = useState<String>('')

    const handleProjectChange = (projectName: String) => {
        setProject(projectName)
    }

    return (
        <div className='flex flex-col gap-5 p-10'>
            <div className='flex flex-row gap-2'>
                <h2>
                    Projects
                </h2>
                <div className='w-full border-b-2 border-dotted border-gray-700'/>
                </div>
            <div id='course-container' className='h-80 flex flex-col gap-2 p-4 sm:m-2 shadow-inner rounded-lg text-black'>
                <ul className='flex flex-col gap-2 clickable'>
                    <li className='flex flex-row items-center gap-1' onClick={() => handleProjectChange('donation-page')}>
                        <div className='w-[1em] h-[1em] rounded-[1em] border border-red-500'/>
                        <h3>
                            Daily Pennsylvanian Alumni Donation Page
                        </h3>
                    </li>
                    <li className='flex flex-row items-center gap-1' onClick={() => handleProjectChange('skyline')}> 
                        <div className='w-[1em] h-[1em] rounded-[1em] border border-red-500'/>
                        <h3>
                            Skyline Interactive
                        </h3>
                    </li>
                    <li className='flex flex-row items-center gap-1' onClick={() => handleProjectChange('spelling-bee')}>
                        <div className='w-[1em] h-[1em] rounded-[1em] border border-red-500'/>
                        <h3>
                        Better-Spelling-Bee
                        </h3>
                    </li>
                </ul>
            </div>
        </div>
    )
}