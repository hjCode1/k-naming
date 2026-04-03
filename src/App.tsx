import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './routes/HomePage';
import LoadingPage from './routes/LoadingPage';
import ResultPage from './routes/ResultPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
