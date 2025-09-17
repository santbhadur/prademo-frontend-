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
import Main from './page/Main';
import Test from './Test';
import Test2 from './page/Test2';
import ViewBill from "./components/ViewBill";
import EditBill from "./components/EditBill";
import Table1 from './page/Table1';
import GstViewBill from './components/GstViewBill';
import ProductPage from "./ProductPage";
import Loader from "./Loader";
import Setting from "./Setting";
import GstEditBill from './components/GstEditBill';
import GstPdf from './components/GstPdf';
import Test3 from './page/Test3';
import SamplePdf from './components/SamplePdf';
function App() {
  return (
    <>
      <Routes>
        {/* Correct way: element expects a JSX component */}
        <Route path="/" element={<Table />} />
        <Route path="/Gst-Pdf" element={<GstPdf />} />
        <Route path="/All-Gst-Bills" element={<Table1 />} />
        <Route path="/view-bill/:id" element={<ViewBill />} />
        <Route path="/view-bills/:id" element={<GstViewBill />} />
        <Route path="/sample-pdf" element={<SamplePdf />} />
        <Route path="/edit-bill/:id" element={<EditBill />} />
        <Route path="/edit-Gst-bill/:id" element={<GstEditBill />} />
        <Route path="/Create-Gst-Bill" element={<Test2 />} />
        <Route path="/Create-Gst-Bills" element={<Test3 />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/Sample-Bill" element={<Test />} />
        <Route path="/Add-Logo" element={<Logo />} />
        <Route path="/Signature" element={<Signature />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/CreateGstBill" element={<CreateGstBill />} />
        <Route path='/GstPreview' element={<GstPreview /> } />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/Sales" element={<Sales />} />
        <Route path="/loader" element={<Loader />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/demos" element={<Demos />} />
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/share-pdf" element={<SharePdf />} />
        <Route path="/products" element={<ProductPage />} />
        
      </Routes>
    </>
  );
}

export default App;
