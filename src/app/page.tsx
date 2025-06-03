import Cover from './components/Cover'
import Timeline from './components/Timeline';
import CourseWork from './components/Coursework';
import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'


const sections = [Cover, CourseWork, Timeline]

export default function Portfolio() {
  return (
    <>
    <NavBar/>
    <div className='flex flex-col overflow-x-hidden'>
      {sections.map((Section, index) => (
        <Section key={index} />
      ))}
    </div>
    <BottomBar/>
    </>
  )
}