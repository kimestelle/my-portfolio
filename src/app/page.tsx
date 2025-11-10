import Cover from './components/Cover'
import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'

export default function Portfolio() {
  return (
    <div className='w-[100svw] h-[100svh] flex overflow-hidden'>
    <NavBar/>
    <Cover/>
    <BottomBar/>
    </div>
  )
}