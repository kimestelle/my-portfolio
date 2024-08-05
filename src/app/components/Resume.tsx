'use client'
import React, { useEffect } from 'react';


export default function Resume() {
  useEffect(() => {
    const adobeScript = document.createElement('script');
    adobeScript.src = 'https://acrobatservices.adobe.com/view-sdk/viewer.js';
    adobeScript.onload = () => {
      document.addEventListener('adobe_dc_view_sdk.ready', function () {
        var adobeDCView = new (window as any).AdobeDC.View({
          clientId: '36222a5b236b40fead7ce55b7891000f',
          divId: 'adobe-dc-view',
        });
        adobeDCView.previewFile(
          {
            content: { location: { url: '/estelle-resume.pdf' } }, // URL to your PDF
            metaData: { fileName: 'EstelleKimResume.pdf' },
          },
          { embedMode: 'SIZED_CONTAINER' }
        );
      });
    };
    document.body.appendChild(adobeScript);
  }, []);

  return (
    <div className='flex flex-col gap-5 p-10'>
      <div className='flex flex-row items-center'>
        <h2>Resume</h2>
        <a href='/path/to/your/file.pdf' download='YourResume.pdf' className='p-2'>
          {/* <img src='icons/download.svg' className='h-6' alt='Download' /> */}
        </a>
        {/* <div className='w-full border-b-2 border-dotted border-gray-700'/> */}
      </div>
      <div id='adobe-dc-view' className='h-96'></div>
    </div>
  );
}
