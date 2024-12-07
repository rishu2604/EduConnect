import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ChatSupport from './components/chat';
import HomePage from './components/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/chat',
    element: <ChatSupport />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
