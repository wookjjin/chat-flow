import Root from '@/components/layout/Root';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
