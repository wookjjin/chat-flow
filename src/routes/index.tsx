import ChatRoom from '@/pages/chat';
import ChatMain from '@/pages/chat-main';
import { createBrowserRouter } from 'react-router';

import RootLayout from '@/components/layout/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <ChatMain />,
      },
      {
        path: 'chat/:id',
        element: <ChatRoom />,
      },
    ],
  },
]);

export default router;
