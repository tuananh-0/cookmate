import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './styles.css';

function Layout({ children }) {
  return <div className="site-shell"><header className="navbar"><Link className="brand" to="/">CookMate</Link><nav className="nav-links"><Link to="/recipes">Recipes</Link><Link to="/login">Log in</Link><Link className="nav-cta" to="/register">Get started</Link></nav></header>{children}<footer className="footer">CookMate · Plan better, cook happier.</footer></div>;
}

function HomePage() {
  return <main className="hero page-container"><div className="hero-copy"><p className="eyebrow">YOUR PERSONAL KITCHEN COMPANION</p><h1>Good food starts with a good plan.</h1><p className="intro">Discover recipes, plan your meals, and prepare your shopping list in one calm, simple place.</p><Link className="primary-button" to="/recipes">Explore recipes <span>→</span></Link></div><div className="hero-card"><span className="hero-emoji">🥕</span><p>What are you cooking today?</p><div className="mini-recipe"><span>🍜</span><strong>Comfort bowl</strong><small>Ready in 25 min</small></div><div className="mini-recipe"><span>🥗</span><strong>Garden salad</strong><small>Fresh & simple</small></div></div></main>;
}

function RecipesPage() { return <main className="page-container content-page"><p className="eyebrow">DISCOVER</p><h1>Recipes</h1><p className="muted">Your recipe collection will appear here.</p></main>; }

function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authenticate(register ? 'register' : 'login', form);
      navigate('/recipes');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to complete request');
    } finally {
      setLoading(false);
    }
  }

  return <main className="page-container auth-page"><p className="eyebrow">COOKMATE ACCOUNT</p><h1>{register ? 'Create your account' : 'Welcome back'}</h1><form className="auth-form" onSubmit={handleSubmit}>{register && <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}<label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading} type="submit">{loading ? 'Please wait...' : register ? 'Create account' : 'Log in'}</button></form></main>;
}

function App() { return <Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/recipes" element={<RecipesPage />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /></Routes></Layout>; }

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></StrictMode>);
