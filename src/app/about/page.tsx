'use client';
import Image from "next/image";
import { CursorTooltip } from "../components/Tooltip";
import TmiCorner from './components/TmiCorner'

export default function About() {
  return (
    <div className="responsive-padding flex flex-col justify-start items-center">
      <div className="w-full max-w-2xl flex flex-col gap-5 pt-8">
        <h2 className="mb-4">Hi — I’m Estelle {':-)'}</h2>

        <p>
          I’m a CS + Computer Graphics student at UPenn.
        </p>

        <p>
          Before I wrote code, I spent three years in California education policy passing legislation, securing funding, and watching well-designed systems not reach the people who needed them.
I started coding because I wanted to build things where logic and play could exist in the same place.
        </p>

        <p>
          I&apos;ve shipped a museum installation to 180k+ visitors, led a team of 7 on a 3D ML visualization, and built data pipelines for a utility serving 15 million residents. Outside of that, I write custom GLSL shaders for things like watercolor drip simulations and burning paper — fun exercises in looking closely at a physical happening and figuring out which parts are actually a system.
        </p>

        <p>
          I work across graphics, full-stack, and data. I find the best tool for the problem and try to actually learn it.
        </p>

        <details
          className="glass-card"
        >
          <summary className="cursor-pointer">
            ✶ tmi corner:
          </summary>

          <TmiCorner/>
        </details>

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
                src="/project-images/covers/watercolor-cover.webp"
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
                src="/project-images/covers/textellation-cover.webp"
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
                src="/project-images/covers/blob-cover.webp"
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
                src="/project-images/covers/poetry-cover.webp"
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
      </div>
    </div>
  );
}
