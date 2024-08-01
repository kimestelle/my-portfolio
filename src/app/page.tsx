import About from './components/About'
import Coursework from './components/Coursework'
import Projects from './components/Projects'
import Creativity from './components/Creativity'
import Leadership from './components/Leadership'

import BottomBar from './components/BottomBar'


const sections = [About, Coursework, Projects, Creativity, Leadership]

export default function Portfolio() {
  return (
    <div className='flex flex-col'>
      {sections.map((Section, index) => (
        <Section key={index} />
      ))}
      <BottomBar/>
    </div>
  )
}