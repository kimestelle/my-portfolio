export default function Resume() {
    return (
        <div className='flex flex-col gap-5 p-10'>
            <div className='flex flex-row items-center'>
                <h2>
                    Resume
                </h2>
                <a className='p-2' href='estelle-kim-resume.pdf'>
                <img src='icons/download.svg' className='h-6'/>
                </a>
                {/* <div className='w-full border-b-2 border-dotted border-gray-700'/> */}
            </div>
            <iframe
                src="estelle-kim-resume.pdf#zoom=100&view=FitH&toolbar=0&navpanes=0"
                width="100%"
                height="500"
                style={{ border: 'none' }}
                className='md:px-20 lg:px-40'
            />
        </div>
    )
}