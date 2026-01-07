'use client';
import Image from "next/image";
import { CursorTooltip } from "../components/Tooltip";
import BouncingText from "../design-deets/BouncingText";

export default function About() {
  return (
    <div className="responsive-padding flex flex-col justify-start items-center">
      <div className="w-full max-w-2xl flex flex-col gap-5 pt-8">
        <h2 className="mb-4">Hi — I’m Estelle {':-)'}</h2>

        <p>
          I build tools that feel physical: interfaces that feel structured, tactile, and real.
        </p>

        <p>
          I’m a CS + Computer Graphics student at UPenn. I like using tech to solve all kinds of problems where design decisions are also systems decisions.
        </p>

        <p>
          Lately that means: full-stack products (from data model to UI), 3D/graphics in WebGL and OpenGL, web experiences that feel like apps,
          and occasional hardware dabbles.
        </p>

        <p>
          I care about clarity over polish. If something isn&apos;t legible or clean, I&apos;ll happily spend more nights re-building it.
        </p>

        <hr/>

        <p>
          A lot is in progress here, but you might find these particularly fun:
        </p>

        <div className='relative w-full flex-row flex gap-2'>
          <CursorTooltip content="cloudy with a chance of..." placement="right-start">
            <a
              className="glass-card cursor-pointer shrink-0 w-16 h-16 md:w-24 md:h-24"
              href="https://watercolor-drip-shader.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/cover-images/watercolor-image.png"
                alt="Watercolor Shader"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="textellation_.*🟅" placement="right-start">
            <a
              className="glass-card cursor-pointer shrink-0 w-16 h-16 md:w-24 md:h-24"
              href="https://textellation.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/cover-images/textellation-image.png"
                alt="Textellation"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="make a softbody jelly" placement="right-start">
            <a
              className="glass-card cursor-pointer shrink-0 w-16 h-16 md:w-24 md:h-24"
              href="https://2d-softbody-lathe.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/cover-images/blob-image.png"
                alt="3D/2D Softbody"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="magnetic poetry board" placement="right-start">
            <a
              className="glass-card cursor-pointer shrink-0 w-16 h-16 md:w-24 md:h-24"
              href="https://magnetic-poetry.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/cover-images/poetry-image.png"
                alt="Magnetic Poetry"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </a>
          </CursorTooltip>
        </div>

        <p>
          Feel free to reach out at {' '} 
          <a href="mailto:kestelle@sas.upenn.edu">
            kestelle@sas.upenn.edu, I always love meeting new people!
          </a>
        </p>
        <details
          className="glass-card"
        >
          <summary className="cursor-pointer">
            ✶ tmi corner
          </summary>

          <section className="flex flex-col gap-2">
            <ul>
              <li>
                on repeat: 
                <div className='inline flex flex-row flex-wrap gap-1 ml-1'>
                  <a href='https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P?si=bb1f2acb6df04e3f' target='_blank' rel='noopener noreferrer'>
                    bad guy
                  </a>,
                  <a href='https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=8f6f2f6f3c6741e5' target='_blank' rel='noopener noreferrer'>
                    someone you loved
                  </a>,
                  <a href='https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b?si=3c8b1f2f5e8645e2' target='_blank' rel='noopener noreferrer'>
                    blinding lights
                  </a>
                </div>
              </li>
              <li>
                currently obsessed with: the color orange, scallops, knitting
              </li>
            </ul>
          </section>
        </details>
      </div>
    </div>
  );
}
