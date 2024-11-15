export default function Me() {
    return (
        <div className='flex flex-[2_2_0%] flex-col gap-5 p-10 md:pl-[20%]'>
            <div className='flex flex-row gap-2 items-center'>
                <h2 className='red font-normal'>
                    Hi!
                </h2>
                    <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target="_blank" className='flex items-center gap-2 font-bold text-[0.8rem]'>
                        <img src="icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                    </a>
            </div>
                <p className='text-sm'>
                I&apos;m a sophomore at UPenn striving to 
                <span className='font-bold'> change the world through the intersection of business strategy, finance, and tech</span>.
                <br/><br/>
                I previously designed sustainable, people-oriented solutions for my communities through legislation and grassroots organizing. Learning technology and finance in college gave me an unbounded canvas; I&apos;m excited to explore and get involved.
                <br/><br/>
                I love learning a little about everything, singing and arranging music with my a capella, playing amateur guitar, all kinds of seafood, and taking odd pictures.
                <br/><br/>
                Let&apos;s connect! I&apos;d love to hear more about you. 
                </p>
        </div>
    )
}