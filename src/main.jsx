import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

import { Provider } from './components/setup/provider';
import { initializeAnalytics } from './utils/analytics';

initializeAnalytics();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <Provider>
    <App />
  </Provider>
);
