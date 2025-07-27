'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function BottomBar() {
  const [showPopup, setShowPopup] = useState(false);
  const [senderInfo, setSenderInfo] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const SERVICE_ID = 'service_v1724ym';
  const TEMPLATE_ID = 'template_ih4rryi';
  const PUBLIC_KEY = 'yHmhElltr_b31xA8j';

  const handleSend = async () => {
    if (message.trim() == '' && senderInfo.trim() == '') return;
    setStatus('sending');

    const templateParams = {
      sender: senderInfo || 'anonymous',
      message: message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus('sent');
      setMessage('');
      setSenderInfo('');
      setTimeout(() => {
        setShowPopup(false);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-6 bg-white/30 backdrop-blur-sm border border-white/40 shadow-xl rounded-full px-4 py-3 flex flex-row gap-2 items-center text-sm z-50">
        <button
          className="text-gray-800 hover:underline"
          onClick={() => setShowPopup(true)}
        >
          let&apos;s connect!
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => {
                setShowPopup(false);
                setStatus('idle');
              }}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-3">to: kestelle@sas.upenn.edu</h2>

            <input
              type="text"
              value={senderInfo}
              onChange={(e) => setSenderInfo(e.target.value)}
              placeholder="where can I reach you? (optional)"
              className="w-full mb-3 p-2 border border-gray-300 rounded-md text-sm"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="message here"
              className="w-full h-28 p-2 border border-gray-300 rounded-md text-sm"
            />

            <button
              onClick={handleSend}
              className="mt-3 text-sm"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'sending...' : (<img src='icons/paper-plane.svg' className='w-8 h-8'/>)}
            </button>

            {status === 'sent' && (
              <p className="mt-2 text-green-600 text-sm">sent, thank you!</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-red-600 text-sm">failed to send. try again.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
