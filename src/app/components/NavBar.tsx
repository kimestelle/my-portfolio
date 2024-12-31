export default function NavBar() {
    return (
        <nav className='w-full flex flex-row z-20 gap-5 p-5 px-10 md:px-32 bg-white fixed border-b border-color-gray-400'>
                <a href='/playground' className='mr-2'>
                    <img className='w-[1.7em] rattle' src='icons/playground.svg'/>
                </a>
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
                {/* <a target='_blank' href='https://github.com/kimestelle'>
                    <img className='w-[1.7em]' src='icons/gh-logo.svg'/>
                </a> */}
        </nav>
        
    )
}
