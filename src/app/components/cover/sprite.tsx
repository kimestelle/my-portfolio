import { useState, useEffect } from 'react';
import './city.css';

const walk1 = '/skyline-images/walk1.svg';
const walk2 = '/skyline-images/walk2.svg';
const walk4 = '/skyline-images/walk4.svg';
const aah = '/skyline-images/aah.svg';

interface SpriteProps {
  index?: number;
  x: number;
  height: number;
  tornado: boolean;
}

const expressions = ["O.o", ">.<", "-.-", "*.*"];

const Sprite = ({ index, x, height, tornado }: SpriteProps) => {
  const [position, setPosition] = useState<number>(x);
  // const [direction, setDirection] = useState<number>(
  //   Math.random() < 0.5 ? -1 : 1
  // );
  const [direction, setDirection] = useState<number>(x < 50 ? 1 : -1);

  const [speed, setSpeed] = useState<number>(
    ((Math.random() + 1) * height) / 15
  );
  const [turn, setTurn] = useState<number>((Math.random() + 1) * 30);
  const [y, setY] = useState<number>(0);
  const [frame, setFrame] = useState<string>(walk1);
  const [frameDuration, setFrameDuration] = useState<number>(100);
  const [spriteHeight, setSpriteHeight] = useState<number>(height);
  const [popupText, setPopupText] = useState<string>("O.o");

  useEffect(() => {
    if (tornado) {
      let incr = height;
      let timing = Math.random() * 200;
      const tornadoInterval = setInterval(() => {
        setY((prevY) => prevY + incr);
        setSpriteHeight((prevHeight) => (prevHeight * 4) / 5);
        incr = (incr - 0.8) * 2;
      }, timing);

      return () => clearInterval(tornadoInterval);
    }
  }, [tornado, height]);

  useEffect(() => {
    if (!tornado) {
      const interval = setInterval(() => {
        if (
          position < 0 ||
          position > 100 - (3 * height) / 7 ||
          turn === 0
        ) {
          if (position < 0) {
            setPosition((2 * height) / 14);
          } else if (position > 100 - (3 * height) / 7) {
            setPosition(100 - (5 * height) / 7);
          }
          setDirection((prevDirection) => -prevDirection);
          setSpeed(((Math.random() + 1) * height) / 15);
          setTurn((Math.random() + 1) * 30);
        }
        setPosition((prevPosition) => prevPosition + direction * speed);
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [tornado, position, direction, speed, height]);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      if (!tornado) {
        if (frame === walk1) {
          setFrame(walk2);
        } else if (frame === walk2) {
          setFrame(walk4);
          setFrameDuration(220);
        } else if (frame === walk4) {
          setFrame(walk1);
          setFrameDuration(140);
        }
      } else {
        setFrame(aah);
      }
    }, frameDuration);

    return () => clearInterval(frameInterval);
  }, [frame, frameDuration, tornado]);

  const randomizeText = () => {
    setPopupText(expressions[Math.floor(Math.random() * expressions.length)]);
  };

  return (
    <div className='sprite-container'
    style={{
      left: `${position}%`,
      height: `${spriteHeight}%`,
      width: `${(spriteHeight * 3) / 7}%`,
      bottom: `${y}%`,
    }}>
    <div className='text-popup shadow-inner z-[10] bg-white'
          style={{
            bottom: `120%`,
          }}
          onMouseEnter={randomizeText}>
      <p>{popupText}</p>
    </div>
    <img
      ref={index as any}
      src={frame}
      className={direction === -1 ? 'sprite' : 'sprite reflect'}
    />
    </div>
  );
};

export default Sprite;
