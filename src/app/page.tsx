import Cover from './components/Cover'
import Coursework from './components/Coursework'
import Projects from './components/Projects'
import Design from './components/Design'
import Me from './components/Me'
import About from './components/About'
import Timeline from './components/Timeline';

import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'


const sections = [Cover, Me, About, Projects, Design, Timeline]

export default function Portfolio() {
  return (
    <>
    <NavBar/>
    <div className='flex flex-col'>
      {sections.map((Section, index) => (
        <Section key={index} />
      ))}
    </div>
    <BottomBar/>
    </>
  )
}