import { useEffect } from 'react';
import MouseFollower from 'mouse-follower';
import gsap from 'gsap';

MouseFollower.registerGSAP(gsap);

export default function PlaygroundCover() {
    useEffect(() => {
        const cursor = new MouseFollower({
            container: document.getElementById('mf-container'),
        });

        return () => {
            cursor.destroy();
        };
    }, []);

    return (
        <div id="mf-container" className="w-full h-full bg-red-100">
            Playground
        </div>
    );
}
