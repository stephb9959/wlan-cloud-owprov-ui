import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import App from 'App';
import 'i18n';
import 'index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
