export default function NavBar() {
    return (
        <nav className='w-full flex flex-row z-20 gap-5 p-5 px-10 md:px-20 bg-white bg-opacity-60 fixed border-b border-color-gray-400'>
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
