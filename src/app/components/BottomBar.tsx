export default function BottomBar() {
    return (
        <div className='flex flex-col sm:flex-row justify-between gap-5 p-10 bg-gray-900 text-white'>
            <span>made with <span className='red'>&#x2665;</span> by Estelle Kim</span>
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