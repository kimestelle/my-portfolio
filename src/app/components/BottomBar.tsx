export default function BottomBar() {
    return (
        <div className='flex flex-col sm:flex-row responsive-padding justify-between gap-5 bg-black text-white'
        style={{ paddingTop: '3rem' }}>
            <p className='text-white'>made with <span className='red'>&#x2665;</span> by Estelle Kim</p>
            <p className='text-white'>[currently under construction :-)]</p>
            <ol className='list-none flex flex-row gap-2 items-end'>
                <li>
                    <img src='icons/mail-icon.svg' className='h-5 w-5'/>
                </li>
                <li className='underline'>
                    <a href='mailto:kestelle@sas.upenn.edu'>
                    kestelle@sas.upenn.edu
                    </a>
                </li>
            </ol>
        </div>
    )
}