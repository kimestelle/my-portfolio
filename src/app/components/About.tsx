import Me from './Me'
import Coursework from './Coursework'

export default function About() {
    return (
        <div className='flex flex-col md:flex-row'>
            <Me/>
            <Coursework/>
        </div>
    )
}