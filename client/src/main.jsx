import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">YOUR PERSONAL KITCHEN COMPANION</p>
      <h1>CookMate</h1>
      <p className="intro">
        Discover recipes, plan your meals, and prepare your shopping list in one place.
      </p>
      <button type="button">Explore recipes</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
