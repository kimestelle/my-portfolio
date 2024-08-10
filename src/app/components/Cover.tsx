export default function About() {
    return (
        <div id='cover' className='relative flex flex-col w-full h-screen justify-center items-start p-10 md:pl-20'>
            <h1 className="relative md:-mt-[35svh] -mt-[30svh] text-[4em] md:text-[8em] z-3">Estelle Kim</h1>
            <h3 className='relative leading-tight mt-2 text-[1em] md:text-[1.5em] z-3'>
                Digital Media Design & Computer Science <span className='red'>@</span> UPenn
            </h3>
            <img src='coverportrait.png' className='w-60 md:w-60  ml-40 md:ml-[33em] z-1 -mt-6 md:-mt-60'/>
        </div>
    )
}