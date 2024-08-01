export default function About() {
    return (
        <div className='flex flex-col w-full h-screen justify-center items-start pl-10 sm:pl-20'>
            <h1 className="-mt-[30svh] text-[5em] md:text-[8em]">Estelle Kim</h1>
            <div className='flex flex-col sm:flex-row text-[0.8em] md:text-[1.3em] gap-1 mt-[1em]'>
                <h3 className='w-max -mb-[0.5em]'>
                    Digital Media Design & Computer Science
                </h3>
                <div className='flex flex-row gap-1'>
                    <h3 className='text-red-600'>
                        @
                    </h3>
                    <h3>
                        UPenn
                    </h3>
                </div>
            </div>
        </div>
    )
}