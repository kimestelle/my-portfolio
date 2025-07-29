import './mood-shader.css'
export default function MoodShaderPage() {
  return (
    <div className="blog-formatting responsive-padding">
        <h1 className="text-3xl font-bold">{'</>'} webGL mood ring shader</h1>
        <p className="text-gray-500 half-margin">June 27, 2025</p>
        <p className="text-gray-600 italic half-margin">wip</p>
        <hr className="my-4" />
        <h2>
            overall goal / effects
        </h2>
        <p>
            subtle, responsive webGL background shader that works across devices
        </p>
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

        <h2>
        implementation
        </h2>
        <h3>
            shader setup
        </h3>
        <ul className='mb-4'>
            <li>
                <span className='font-bold'>fullscreen</span> canvas using ThreeJS
            </li>
            <li>
                <span className='font-bold'>2D plane geometry</span> and ShaderMaterial with <span className='font-bold'>custom fragment shader</span>
            </li>
        </ul>
        <h3>
            heat logic
        </h3>
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
        <h2>
            heat logic
        </h2>
        <h2>
            color palette
        </h2>
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