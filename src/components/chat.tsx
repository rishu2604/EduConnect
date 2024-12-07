import React, { useEffect, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  ChatBubble,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { ExpandableChatHeader } from '@/components/ui/chat/expandable-chat';

type Message = {
  id: number;
  message: string;
  sender: 'user' | 'bot';
  isLoading?: boolean;
};

export default function ChatSupport() {
  const id = uuidv4();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle user input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle keydown event (Enter to submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter key behavior (new line)
      handleSubmit(e);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      message: input.trim(),
      sender: 'user'
    };

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);

    // Clear input field
    setInput('');

    // Simulate bot response with loading
    const botLoadingMessage: Message = {
      id: messages.length + 2,
      message: '',
      sender: 'bot',
      isLoading: true
    };
    setMessages((prev) => [...prev, botLoadingMessage]);

    try {
      // Fetch response from API with streaming
      const response = await fetch('http://192.168.104.235:3000/api/v1/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input.trim(), id })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let message = '';

      while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        message += decoder.decode(value, { stream: true });

        // Update the message in the state while streaming
        setMessages((prev) => [
          ...prev.slice(0, prev.length - 1), // Remove the loading message
          {
            id: messages.length + 2,
            message: message,
            sender: 'bot',
            isLoading: false
          }
        ]);
      }

      // // Once the stream is done, set the final message
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1), // Remove the loading message
        {
          id: messages.length + 2,
          message: message || "I didn't get a valid response.",
          sender: 'bot',
          isLoading: false
        }
      ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // In case of error, show the connection error message from bot
      const botErrorMessage: Message = {
        id: messages.length + 2,
        message: 'Sorry, there was a connection error. Please try again later.',
        sender: 'bot',
        isLoading: false
      };

      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1), // Remove the loading message
        botErrorMessage
      ]);
    }
  };

  return (
    <div className='flex h-[100vh] w-full flex-col bg-stone-950 text-white'>
      {/* Chat Header */}
      <ExpandableChatHeader className='w-full flex-col justify-center p-4 text-center'>
        <h1 className='text-xl font-semibold'>Chat with our AI ✨</h1>
        <p>Ask any question for our AI to answer</p>
        <div className='flex items-center gap-2 pt-2'>
          <Button variant='secondary' onClick={() => setMessages([])}>
            New Chat
          </Button>
          <Button variant='secondary'>See FAQ</Button>
        </div>
      </ExpandableChatHeader>

      {/* Chat Messages */}
      <ChatMessageList className='flex-1 overflow-auto p-4' ref={messagesRef}>
        {messages.map((message) => {
          const variant = message.sender === 'user' ? 'sent' : 'received';
          return (
            <ChatBubble key={message.id} variant={variant}>
              <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
              <ChatBubbleMessage isLoading={message.isLoading}>{message.message}</ChatBubbleMessage>
              <ChatBubbleActionWrapper>{/* Action Icons */}</ChatBubbleActionWrapper>
            </ChatBubble>
          );
        })}
      </ChatMessageList>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className='flex items-center p-4'>
        <div className='sticky bottom-2 flex w-full flex-row items-center gap-x-4 text-black'>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Type your message here...'
          />
          <Button
            variant='outline'
            type='submit'
            disabled={!input.trim()}
            style={{
              width: '8%',
              height: '47px'
            }}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
