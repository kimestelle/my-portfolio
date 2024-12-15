import Cover from './components/Cover'
import Coursework from './components/Coursework'
import Projects from './components/Projects'
import Design from './components/Design'
import Creative from './components/Creative'
import Resume from './components/Resume'
import About from './components/About'
import Timeline from './components/Timeline';

import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'


const sections = [Cover, About, Projects, Design, Creative, Timeline]

export default function Portfolio() {
  return (
    <>
    <NavBar/>
    <div className='flex flex-col md:gap-10'>
      {sections.map((Section, index) => (
        <Section key={index} />
      ))}
    </div>
    <BottomBar/>
    </>
  )
}