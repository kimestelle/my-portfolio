import Image from 'next/image';

export default function NavBar() {
    return (
        <nav className='w-full flex flex-row justify-between z-20 p-5 px-10 md:px-32 bg-white fixed border-b border-color-gray-400'>
            <div className='w-full flex flex-row items-center gap-5'>
                <a href='#cover'><img className='h-4 w-4 md:h-6 md:w-6' src='/icons/home.svg'/></a>
                {/* <a href='#about'>
                    about
                </a> */}
                <a href='/projects'>
                    projects
                </a>
                <a href='#experience'>
                    experience
                </a>
                {/* <a href='#design'>
                    creative
                </a> */}
                <a href='/blog' className='red'>
                    blog
                </a>
            </div>
                {/* <a href='https://github.com/kimestelle' target='_blank' className='mr-2'>
                    <Image className='w-[1.7em]' src='icons/gh-logo.svg' width={10} height={10} alt="github icon"/>
                </a> */}
        </nav>
        
    )
}
