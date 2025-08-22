import './App.css';
import SharePdf from './SharePdf';
import Demo from './Demo';
import CreateBill from './page/CreateBill';
import Demos from './page/Demo';
import { Routes, Route } from 'react-router-dom';
import Table from './page/Table';
import Reports from './page/Reports';
import Sales from './page/Sales';
import CreateGstBill from './page/CreateGstBill';
import GstPreview from './page/GstPreview';
import Logo from './page/Logo';
import Signature from './page/Signature';

function App() {
  return (
    <>
      <Routes>
        {/* Correct way: element expects a JSX component */}
        <Route path="/" element={<Table />} />
        <Route path="/Logo" element={<Logo />} />
        <Route path="/Signature" element={<Signature />} />
        <Route path="/CreateGstBill" element={<CreateGstBill />} />
        <Route path='/GstPreview' element={<GstPreview /> } />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/Sales" element={<Sales />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/demos" element={<Demos />} />
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/share-pdf" element={<SharePdf />} />
        
      </Routes>
    </>
  );
}

export default App;
