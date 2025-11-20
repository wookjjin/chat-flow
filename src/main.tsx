import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';

import router from '@/routes/index';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
);
