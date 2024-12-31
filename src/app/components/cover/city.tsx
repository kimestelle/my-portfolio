import { useState, useEffect, useRef, useCallback } from 'react';
import blockImages from './block-menu';
import './city.css';
import Sprite from './sprite';

class Block {
  name: string;
  src: string;
  x: number;
  height: number;
  y: number;
  flyOutInterval: NodeJS.Timeout | null;

  constructor(name: string, src: string, x: number, height: number) {
    this.name = name;
    this.src = src;
    this.x = x;
    this.height = height;
    this.y = 0;
    this.flyOutInterval = null;
  }

  changeHeight(newHeight: number) {
    this.height = Math.min(newHeight, 100);
  }

  flyOut() {
    if (this.flyOutInterval) {
      clearInterval(this.flyOutInterval);
    }
    const xInc = Math.random() < 0.5 ? -4 : 4;
    let yInc = Math.random() < 0.5 ? -1 : 1;
    let heightFactor = 40;

    this.flyOutInterval = setInterval(() => {
      if (Math.abs(this.y) >= 400 && Math.abs(this.x) >= 400) {
        clearInterval(this.flyOutInterval!);
        this.flyOutInterval = null;
        yInc = 0;
        return;
      }
      this.x += xInc;
      this.y += yInc * 3;
      this.changeHeight((heightFactor * 1) / 3);
      yInc *= 2;
    }, 10);
  }
}


function City() {
  const [blocks, setBlocks] = useState<Block[]>([
    new Block('sprite', '/skyline-images/sprite.svg', 20, 15),
    new Block('sprite', '/skyline-images/sprite.svg', 50, 10),
    new Block('tree', '/skyline-images/tree.svg', 80, 25),
  ]);
  const [tornado, setTornado] = useState<boolean>(false);
  const currentBlockRef = useRef<Block | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentBlockHeight, setCurrentBlockHeight] = useState(5);

  const blocksFly = useCallback(() => {
    console.log('TORNADOOOOO');
  
    let index = 0;

    const tornadoInterval = setInterval(() => {
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];

        if (index < newBlocks.length) {
          newBlocks[index].flyOut();
          index++;
        } else {
          clearInterval(tornadoInterval);
        }
  
        return newBlocks;
      });
    }, 100);
  
    setTimeout(() => {
      setBlocks([]);
    }, 1500);
  }, []);
  

  useEffect(() => {
    if (blocks.length > 10) {
      setTornado(true);
      blocksFly();
      setTimeout(() => { setTornado(false); }, 1500);
    }
  }, [blocks, blocksFly]);

  const getRandomBlock = () => {
    const randomIndex = Math.floor(Math.random() * blockImages.length);
    console.log(blockImages[randomIndex]);
    return blockImages[randomIndex];
  };

  const instantiateBlock = (e: React.PointerEvent) => {
    if (currentBlockRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const randomBlock = getRandomBlock();
    console.log('Random Block:', randomBlock);
    currentBlockRef.current = new Block(randomBlock.name, randomBlock.src, xPercent, 5);
    console.log('Current Block:', currentBlockRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentBlockHeight((prevHeight) => {
        const newHeight = prevHeight + 1;
        currentBlockRef.current?.changeHeight(newHeight);
        return Math.min(newHeight, 100);
      });
    }, 100);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (currentBlockRef.current) {
      const finalBlock = currentBlockRef.current; //capture block before it turns null
      console.log('Final Block:', finalBlock);
      setBlocks((prev) => [...prev, finalBlock]);
      currentBlockRef.current = null;
      setCurrentBlockHeight(5);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    instantiateBlock(e);
  };

  const handlePointerUp = () => {
    stopCounter();
  };

  return (
    <>
      <div
        className={tornado ? 'city notouch' : 'city'}
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
{blocks.map((block, index) =>
  block && block.name && block.src ? (
    block.name === 'sprite' ? (
      <Sprite key={index} x={block.x} height={block.height} tornado={tornado} />
    ) : (
      <img
        key={index}
        src={block.src}
        style={{
          position: 'absolute',
          left: `${block.x}%`,
          bottom: `${block.y}svh`,
          height: `${block.height}%`,
          width: 'auto',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    )
  ) : null // Skip rendering if the block is incomplete
)}

        {currentBlockRef.current && (
          <img
            src={currentBlockRef.current.src}
            className="block"
            style={{
              position: 'absolute',
              left: `${currentBlockRef.current.x}%`,
              bottom: `${currentBlockRef.current.y}svh`,
              height: `${currentBlockHeight}%`,
              opacity: '0.8',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}
      </div>
    </>
  );
}

export default City;
