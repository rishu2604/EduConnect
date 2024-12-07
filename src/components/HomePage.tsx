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
      {showContent && (
        <div className="flex justify-end items-center p-4 bg-gray-100 text-gray-800 shadow-md ">
          <div className="px-4 py-2 mx-2">
            <Button
              variant="outline"
              className="bg-gray-200 text-gray-800 text-sm px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300"
              onClick={navigateHandler}
            >
              Chat with AI Assistant
            </Button>
          </div>

        </div>
      )}


      <div
        className={`flex h-screen flex-col md:flex-row items-center justify-center md:justify-around transition-all duration-1000   ${showContent ? ' text-black bg-gray-100' : 'bg-black text-white'
          }`}
      >
        <div
          className={`transition-all duration-1000 ${showContent ? 'translate-y-[-50px]' : 'translate-y-0'}`}
        >
          <div className='flex flex-row items-center'>
            <img src={ImageMain} alt='' style={{ height: '100px', width: '100px' }} />
            <h1 className="font-mono text-5xl font-bold flex flex-col items-center">
              EduConnect
              <span className="text-sm font-medium mt-2 text-gray-600">
                Connecting knowledge, empowering learning
              </span>
            </h1>

          </div>
          {/* {showContent && <h4 className='ml-7 font-mono text-2xl font-semibold block md:hidden'>Upload Files</h4>} */}
          {showContent && <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-md text-left font-mono md:block hidden font">
            EduConnect simplifies your workflow by turning documents into insights. Upload files, generate articles, and get instant answers with our AI-powered chatbot. Work smarter with EduConnect!
          </p>}
        </div>
        {/* {showContent && } */}
        {showContent && <UploadFiles />}
      </div>

    </>
  );
};

export default HomePage;
