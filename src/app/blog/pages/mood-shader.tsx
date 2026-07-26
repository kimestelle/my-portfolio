import './mood-shader.css'
import { ShimmerText } from '@/app/design-deets/text-shimmer/TextShimmer';

export default function MoodShaderPage() {
  return (
    <div className="blog-formatting max-w-2xl">
        <ShimmerText as="h1" className="text-3xl font-bold">{'</> webGL mood ring shader'}</ShimmerText>
        <ShimmerText className="text-gray-500 half-margin">June 27, 2025</ShimmerText>
        <ShimmerText className="text-gray-600 italic half-margin">wip</ShimmerText>
        <hr className="my-4" />
        <ShimmerText as="h2">overall goal / effects</ShimmerText>
        <ShimmerText>subtle, responsive webGL background shader that works across devices</ShimmerText>
        <ul className='mb-4'>
            <li>
            <span className='font-bold'>minimal presence</span>: doesn&apos;t compete with layout or text
            </li>
            <li>
            <span className='font-bold'>physical motion</span>: movement grows and dissolves like body heat on a surface
            </li>
            <li>
            <span className='font-bold'>layered response</span>: overlapping touches create variation over time
            </li>
        </ul>

        <ShimmerText as="h2">implementation</ShimmerText>
        <ShimmerText as="h3">shader setup</ShimmerText>
        <ul className='mb-4'>
            <li>
                <span className='font-bold'>fullscreen</span> canvas using ThreeJS
            </li>
            <li>
                <span className='font-bold'>2D plane geometry</span> and ShaderMaterial with <span className='font-bold'>custom fragment shader</span>
            </li>
        </ul>
        <ShimmerText as="h3">heat logic</ShimmerText>
        <ul className='mb-4'>
            <li>
                stored coordinate points along mouse or touch movements in <span className='font-bold'>heatSpots</span> <code>{'{ '}x, y, createdAt{' }'}</code>
            </li>
            <li>
                maximum 50 spots stored at any single moment for performance, spots removed after 10 seconds
            </li>
            <li>
                spots removed after 10 seconds
            </li>
        </ul>
        <ShimmerText as="h2">heat logic</ShimmerText>
        <ShimmerText as="h2">color palette</ShimmerText>
        <div id='gradient-field' className='w-full aspect-[3/2] relative overflow-hidden'>
        <div className="absolute inset-0 pointer-events-none gradient-fade z-8 "/>
        <div className="absolute w-[50%] inset-0 pointer-events-none z-10 "
        style={{
            backgroundImage: "url('/textures/sandpaper.png')",
            backgroundSize: 'repeat',
            opacity: 1, 
            mixBlendMode: 'lighten',
        }}/>
        </div>
    </div>
);
}
