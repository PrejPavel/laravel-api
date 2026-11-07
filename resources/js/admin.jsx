import React from 'react';
import ReactDOM from 'react-dom/client';
import Admin from './components/Admin.jsx';

const rootElement = document.getElementById('admin');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Admin />
        </React.StrictMode>
    );
}
