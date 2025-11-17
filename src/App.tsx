import { Toaster } from 'sonner';
import { BrowserRouter, Route, Routes } from 'react-router';
import Root from './components/layout/Root';

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
