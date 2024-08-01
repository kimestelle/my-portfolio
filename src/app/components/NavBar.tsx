export default function NavBar() {
    return (
        <div className='w-full flex flex-row z-10 gap-5 p-5 px-10 bg-white fixed border-b border-color-gray-400'>
            <button className='hidden sm:block'>
                About
            </button>
            <button className='hidden sm:block'>
                Coursework
            </button>
            <button className='hidden sm:block'>
                Projects
            </button>
            <button className='hidden sm:block'>
                Creativity
            </button>
            <button className='hidden sm:block'>
                Leadership
            </button>
            <div className='w-full flex flex-row justify-end gap-6'>
                <button>
                    <img className='w-[1.7em]' src='/gh-logo.svg'/>
                </button>
                <button>
                    <img className='w-[1.7em]' src='/playground.svg'/>
                </button>
            </div>
        </div>
    )
}