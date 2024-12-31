'use client';
import AutoScroll from "./AutoScroll";

export default function Me() {
    const images = [
        '/me-images/image-1.png',
        '/me-images/image-2.png',
        '/me-images/image-3.png',
        '/me-images/image-4.png',
        '/me-images/image-5.png',
        '/me-images/image-6.png',
        '/me-images/image-7.png',
        '/me-images/image-8.png',
        '/me-images/image-9.png',
        '/me-images/image-10.png',
      ];
    return (
        <>
        <div id='about' className='flex flex-[2_2_0%] flex-col gap-5 p-10 pt-0 pb-3 md:px-32 bg-black border border-black'>
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
                            I love the color red, museum-hopping, late-night delivery food, singing a capella, and listening to / playing / trying to make all kinds of music.
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
