import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import ImageMain from '../assets/images/icon-removebg-preview.png';
import { Button } from './ui/button';
import UploadFiles from './upload-files';

const HomePage = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  function navigateHandler() {
    navigate('/chat');
  }

  return (
    <>
      <div
        className={`flex h-screen flex-col items-center justify-center transition-all duration-1000 ${
          showContent ? 'bg-white text-black' : 'bg-black text-white'
        }`}
      >
        <div
          className={`transition-all duration-1000 ${showContent ? 'translate-y-[-50px]' : 'translate-y-0'}`}
        >
          <div className='flex flex-row items-center'>
            <img src={ImageMain} alt='' style={{ height: '100px', width: '100px' }} />
            <h1 className='font-mono text-5xl font-bold'>EduConnect</h1>
          </div>
          {showContent && <h4 className='ml-7 font-mono text-2xl font-semibold'>Upload Files</h4>}
        </div>
        {showContent && <UploadFiles />}
      </div>
      {showContent && (
        <div className='sticky bottom-10 z-50 bg-white p-2 text-center'>
          <Button variant='link' size='sm' onClick={navigateHandler}>
            Chat with your AI Assistant
          </Button>
        </div>
      )}
    </>
  );
};

export default HomePage;
