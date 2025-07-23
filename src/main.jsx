import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import Layout from './routes/Layout';
import DetailView from './routes/DetailView';
import NotFound from './routes/NotFound';
import BookDetail from "./components/BookDetail";
import AuthorPage from './routes/AuthorPage';
import SubjectPage from './routes/SubjectPage';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="book/:bookKey" element={<BookDetail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="author/:authorName" element={<AuthorPage />} />
          <Route path="subject/:subjectName" element={<SubjectPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
