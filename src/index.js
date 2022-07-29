import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import main_en from './translations/en/main.json';
import main_sr from './translations/sr/main.json';
import form_en from './translations/en/form.json';
import form_sr from './translations/sr/form.json';
import './styles/index.css';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      main: main_en, // 'main' is our custom namespace
      form: form_en,
    },
    sr: {
      main: main_sr,
      form: form_sr,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
