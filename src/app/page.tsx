import Cover from './components/Cover'
import Coursework from './components/Coursework'
import Projects from './components/Projects'
import Design from './components/Design'
import Resume from './components/Resume'
import About from './components/About'

import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'


const sections = [Cover, About, Projects, Design, Resume]

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