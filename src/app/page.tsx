'use client'
import Cover from './components/Cover'
import ProjectHTML from './components/ProjectHTML'

export default function Portfolio() {
  return (
    <main className="responsive-padding w-full">
      <div className="page-frame-wide">
        <Cover/>
        <ProjectHTML />
      </div>
    </main>
  )
}
