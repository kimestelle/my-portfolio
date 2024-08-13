export default function BottomBar() {
    return (
        <div className='flex flex-col gap-5 p-10 bg-gray-900 text-white'>
            <h2>
                Contact Me!
            </h2>
            <ol className='list-none flex flex-row gap-2 items-center'>
                <li>
                    <img src='icons/mail-icon.svg' className='h-5 w-5'/>
                </li>
                <li>
                    <a href='mailto:kestelle@sas.upenn.edu'>
                    kestelle@sas.upenn.edu
                    </a>
                </li>
            </ol>
        </div>
    )
}