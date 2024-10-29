export default function NavBar() {
    return (
        <nav className='w-full flex flex-row z-20 gap-5 p-5 px-10 bg-white fixed border-b border-color-gray-400'>
            <a className='sm:hidden' href='/#cover'>
                <img src='icons/home.svg' className='w-[1.9em]'/>
            </a>
            <a className='hidden sm:block' href='/#cover'>
                About
            </a>
            <a className='hidden sm:block' href='/#code'>
                Projects
            </a>
            <a className='hidden sm:block' href='/#creativity'>
                Design
            </a>
            <a className='hidden sm:block' href='/#community'>
                Resume
            </a>
            <div className='w-full flex flex-row justify-end gap-6'>
                <a href='/playground'>
                    <img className='w-[1.7em] rattle' src='icons/playground.svg'/>
                </a>
                <a target='_blank' href='https://github.com/kimestelle'>
                    <img className='w-[1.7em]' src='icons/gh-logo.svg'/>
                </a>
            </div>
        </nav>
        
    )
}
