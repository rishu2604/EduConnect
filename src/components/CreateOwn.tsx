import { error } from 'console';
import { useState } from 'react';

import { imageBlockConfig } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import {
  useBlockNote,
  useBlockNoteContext,
  useBlockNoteEditor,
  useCreateBlockNote
} from '@blocknote/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import axios from 'axios';

import LoadingGif from '../assets/images/load.gif';
import { Button } from './ui/button';

export default function CreateOwn() {
  const editor = useCreateBlockNote();

  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleNotesClick = async () => {
    try {
      setIsSubmitting(true);
      const documentContent = editor.document;
      console.log('🚀 ~ handleNotesClick ~ documentContent:', documentContent);
      const response = await axios.post('http://192.168.104.235:3000/api/v1/rag/feedback', {
        document: documentContent
      });

      setFeedback(response.data || 'Feedback not available');
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveContent = async () => {
    try {
      setIsSubmitting(true);
      const documentContent = editor.document;
      console.log('🚀 ~ handleNotesClick ~ documentContent:', documentContent);
      const response = await axios.post('http://192.168.104.235:3000/api/v1/rag/feedback', {
        document: documentContent
      });

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex h-full flex-row'>
      <div className='mt-4 h-[90%] w-[60%]'>
        <div className='mr-6 flex flex-row justify-between'>
          <h1 className='ml-6 flex justify-start font-mono text-xl font-bold'>
            Create your own Document
          </h1>
          <Button variant='default' onClick={handleSaveContent}>
            Save
          </Button>
        </div>
        <div className='m-5 h-[94%] rounded-xl border-2 border-black p-4'>
          <BlockNoteView editor={editor} theme='light' sideMenu={true} />
        </div>
      </div>
      <div className='m-4 w-[37%]'>
        <Button variant='outline' onClick={handleNotesClick}>
          Get Feedback
        </Button>

        <div className='mt-4 h-[88%] w-[100%] overflow-auto rounded-xl border-2 border-black'>
          {isSubmitting && <img src={LoadingGif} alt='Loading...' className='m-auto' />}
          <MarkdownPreview
            source={feedback}
            style={{ padding: 16, backgroundColor: 'white', color: 'black' }}
          />
        </div>
      </div>
    </div>
  );
}

