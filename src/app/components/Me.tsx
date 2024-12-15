export default function Me() {
    return (
        <div className='flex flex-[2_2_0%] flex-col gap-5 p-10 md:pl-20'>
            <div className='flex flex-row gap-2 mb-2 md:mb-5 items-center'>
                <h2 className='red font-normal'>
                    Hi!
                </h2>
                    {/* <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target="_blank" className='flex items-center gap-2 font-bold text-[0.8rem]'>
                        <img src="icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                    </a> */}
            </div>
                <p>
                I&apos;m a sophomore at UPenn striving to create <span className='font-bold'>accessible, intuitive digital spaces that empower people</span>.
                <br/><br/>
                I love making things with friends, museum hopping, learning a little about everything, singing a capella, learning instruments, all kinds of seafood, and taking odd pictures.
                <br/><br/>
                Thank you for considering my application!
                </p>
        </div>
    )
}