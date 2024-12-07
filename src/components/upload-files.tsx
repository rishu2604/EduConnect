import React, { ChangeEvent, useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Gif from '../assets/images/Animation - 1733519997555.gif';
import Done from '../assets/images/Done.mp4';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './ui/toast';

const UploadFiles: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [progressInfos, setProgressInfos] = useState<{ percentage: number; fileName: string }[]>(
    []
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setISubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [enteredUrl, setEnteredUrl] = useState<string>('');
  //   const [fileInfos, setFileInfos] = useState<{ name: string; url: string }[]>([]);

  //   useEffect(() => {
  //     axios.get('192.168.104.235:3000/api/v1/file/list').then((response) => {
  //       setFileInfos(response.data);
  //     });
  //   }, []);

  const navigate = useNavigate();

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setProgressInfos([]);
    setSelectedFiles(event.target.files);
    setIsSubmitted(false);
  };

  const handleUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredUrl(event.target.value);
  };

  const upload = async (idx: number, file: File) => {
    const _progressInfos = [...progressInfos];
    const formData = new FormData();
    formData.append('files', file);
    setISubmitting(true);
    try {
      const response = await axios.post(
        'http://192.168.104.235:3000/api/v1/files/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
          // onUploadProgress: (event) => {
          //   _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
          //   setProgressInfos([..._progressInfos]);
          // }
        }
      );

      setToastMessage(`Uploaded the file successfully: ${file.name}`);

      setIsSubmitted(true);

      setTimeout(() => {
        setToastMessage(null);
        setISubmitting(false);
      }, 3000);
    } catch (error) {
      _progressInfos[idx].percentage = 0;
      setProgressInfos([..._progressInfos]);
      setToastMessage(`Could not upload the file: ${file.name}`);
    }
  };

  const uploadUrl = async () => {
    if (!enteredUrl) return; // Don't send if the URL is empty

    try {
      setISubmitting(true);
      await axios.put(
        'http://192.168.104.235:3000/api/v1/rag/index',
        {
          webUrl: enteredUrl
        },
        {
          timeout: 300000
        }
      );
      setToastMessage(`URL uploaded successfully: ${enteredUrl}`);
      setIsSubmitted(true);

      setTimeout(() => {
        setToastMessage(null);
        setISubmitting(false);
        setEnteredUrl('');
      }, 3000);
    } catch (error) {
      setToastMessage(`Failed to upload URL: ${enteredUrl}`);
      setISubmitting(false);
    }
  };

  const uploadFiles = () => {
    if (selectedFiles) {
      const _progressInfos = Array.from(selectedFiles).map((file) => ({
        percentage: 0,
        fileName: file.name
      }));

      setProgressInfos(_progressInfos);

      Array.from(selectedFiles).forEach((file, index) => {
        upload(index, file);
      });
    }
    if (enteredUrl.trim() !== '') {
      uploadUrl();
    }
  };

  return (
    <ToastProvider>
      <div>
        {/* {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className='mb-2' key={index}>
              <span>{progressInfo.fileName}</span>
              {progressInfo.percentage < 100 ? <Progress value={progressInfo.percentage} /> : null}
            </div>
          ))} */}

        {/* <div className='row my-3'> */}
        {!isSubmitting && (
          <div className='mt-10 flex flex-col gap-x-6'>
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <Label className='font-bold' htmlFor='file'>
                Choose File
              </Label>

              <div className='flex flex-col items-center gap-y-6'>
                <div>
                  <Input id='file' type='file' multiple onChange={selectFiles} />
                  <span className='mt-5 text-xs text-gray-600'>
                    Upload files in one of the following formats:
                    <span className='font-semibold'> .doc, .pdf, .csv, or .json</span>
                  </span>
                </div>
                <Input
                  placeholder='Enter URL'
                  id='url'
                  type='url'
                  value={enteredUrl}
                  onChange={handleUrl}
                />

                <Button
                  variant='default'
                  size='sm'
                  disabled={!selectedFiles && enteredUrl.trim() === ''}
                  // disabled={isSubmitting}
                  onClick={uploadFiles}
                  style={{ width: '50%' }}
                >
                  Upload
                </Button>
                <Button
                  variant='outline'
                  onClick={navigate('/create')}
                  style={{ width: 'w-100%', marginTop: '10px' }}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}
        {isSubmitting && (
          <div>
            <img src={Gif} alt='Uploading...' />
            <span>Wait while we upload your files</span>
          </div>
        )}

        {/* {isSubmitted && <img src={Done} alt='Done' />} */}

        {toastMessage && (
          <Toast
            variant='default'
            className='bg-green-500 text-white' // Customize with color
          >
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
        )}

        {/* <div className='card'>
        <div className='card-header'>List of Files</div>
        <ul className='list-group list-group-flush'>
          {fileInfos &&
            fileInfos.map((file, index) => (
              <li className='list-group-item' key={index}>
                <a href={file.url}>{file.name}</a>
              </li>
            ))}
        </ul>
      </div> */}
      </div>
      <ToastViewport />
    </ToastProvider>
  );
};

export default UploadFiles;
