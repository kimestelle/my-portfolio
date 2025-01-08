import Image from 'next/image';

export default function NavBar() {
    return (
        <nav className='w-full flex flex-row justify-between z-20 p-5 px-10 md:px-32 bg-white fixed border-b border-color-gray-400'>
            <div className='w-full flex flex-row gap-5'>
                <a href='#about'>
                    about
                </a>
                <a href='#projects'>
                    projects
                </a>
                <a href='#design'>
                    design
                </a>
                <a href='#experience'>
                    experience
                </a>
                <a href='/playground' className='red'>
                    playground
                </a>
            </div>
                {/* <a href='https://github.com/kimestelle' target='_blank' className='mr-2'>
                    <Image className='w-[1.7em]' src='icons/gh-logo.svg' width={10} height={10} alt="github icon"/>
                </a> */}
        </nav>
        
    )
}
