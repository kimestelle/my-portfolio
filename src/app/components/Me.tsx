'use client';
import AutoScroll from "./AutoScroll";

export default function Me() {
    const images = [
        '/project-images/sample-1.png',
        '/project-images/sample-2.png',
        '/project-images/sample-3.png',
      ];
    return (
        <>
        <div className='flex flex-[2_2_0%] flex-col gap-5 p-10 pt-0 pb-3 md:px-32 bg-black border border-black'>
            <h3 className='text-white font-normal z-[2]'>
                a bit about me...
            </h3>
            <div className='relative flex flex-col gap-2 mb-2 md:mb-5 z-[2]'>
                <div className='flex flex-col gap-2 text-white mb-3'> 
                    <ol className='text-regular flex flex-col gap-2'>
                        <li>
                            I was born in Korea and grew up between New York, Seoul, and SoCal.
                        </li>
                        <li>
                            I love the color red, museum-hopping, singing a capella, and listening to / playing / trying to make all kinds of music.
                        </li>
                        <li>
                            My guilty pleasure is coercing friends into DoorDashing midnight desserts.
                        </li>
                        <li>
                            You can probably find me on campus chasing down a squirrel for a picture, wandering aimlessly, or taking .5s of the sky.
                        </li>
                    </ol>
                </div>
                <AutoScroll images={images} />   
            </div>
        </div>
        <img src="/wave-border.svg" className='h-5 w-auto object-cover'/>
        </>
    );
}
