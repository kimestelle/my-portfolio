export default function About() {
    return (
        <div id='cover' className='relative flex flex-col w-full h-[70svh] md:h-[50svh]  justify-center items-start p-10 md:pl-20 overflow-hidden'>
            <h1 className="relative mt-[20svh] text-[4em] md:text-[8em] z-3">Estelle Kim</h1>
            <h3 className='relative leading-tight mt-2 text-[1em] md:text-[1.5em] z-3'>
                Computer Science <span className='red'>@</span> UPenn
            </h3>
            <img src='coverportrait.png' className='w-60 md:w-60  ml-40 md:ml-[34em] z-1 -mt-2 md:-mt-60'/>
        </div>
    )
}