export default function Me() {
    return (
        <div className='flex flex-[2_2_0%] flex-col gap-5 p-10 md:pl-[20%]'>
            <div className='flex flex-row gap-2 mb-2 md:mb-5 items-center'>
                <h2 className='red font-normal'>
                    Hi!
                </h2>
                    <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target="_blank" className='flex items-center gap-2 font-bold text-[0.8rem]'>
                        <img src="icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                    </a>
            </div>
                <p>
                I&apos;m a sophomore at UPenn striving to 
                <span className='font-bold'> change the world through the intersection of business strategy, finance, and tech</span>.
                <br/><br/>
                I love designing solutions that truly resonate with people and working collaboratively to bring them to life. Learning technology in college gave me an unbounded canvas; I&apos;m excited to explore the possibilities.
                <br/><br/>
                Some of my favorite pastimes are learning a little about everything, singing and arranging music with my a capella group, playing amateur guitar, all kinds of seafood, and taking odd pictures.
                <br/><br/>
                Let&apos;s connect! I&apos;d love to hear more about you. 
                </p>
        </div>
    )
}