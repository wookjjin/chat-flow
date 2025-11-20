import { createBrowserRouter } from 'react-router';

import RootLayout from '@/components/layout/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [],
  },
]);

export default router;
