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
    ],
  },
]);

export default router;
