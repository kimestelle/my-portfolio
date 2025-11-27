'use client'
import { useState } from 'react'
import Cover from './components/Cover'
import NavBar from './components/NavBar'
import BottomBar from './components/BottomBar'

export default function Portfolio() {
  const [navHidden, setNavHidden] = useState(false);
  return (
    <div className='w-[100svw] h-[100svh] overflow-x-hidden flex'>
    <NavBar hide={navHidden}/>
    <Cover onScrollZoneActive={setNavHidden}/>
    <BottomBar/>
    </div>
  )
}