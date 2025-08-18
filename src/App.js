import './App.css';
import SharePdf from './SharePdf';
import Demo from './Demo';
import CreateBill from './page/CreateBill';
import Demos from './page/Demo';
import { Routes, Route } from 'react-router-dom';
import Table from './page/Table';

function App() {
  return (
    <>
      <Routes>
        {/* Correct way: element expects a JSX component */}
        <Route path="/" element={<Demo />} />
        <Route path="/demo" element={<Demos />} />
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/share-pdf" element={<SharePdf />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </>
  );
}

export default App;
