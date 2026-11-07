import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import api from './lib/api.js';
import './styles.css';

function Layout({ children }) {
  return <div className="site-shell"><header className="navbar"><Link className="brand" to="/">CookMate</Link><nav className="nav-links"><Link to="/recipes">Recipes</Link><Link to="/login">Log in</Link><Link className="nav-cta" to="/register">Get started</Link></nav></header>{children}<footer className="footer">CookMate · Plan better, cook happier.</footer></div>;
}

function HomePage() {
  return <main className="hero page-container"><div className="hero-copy"><p className="eyebrow">YOUR PERSONAL KITCHEN COMPANION</p><h1>Good food starts with a good plan.</h1><p className="intro">Discover recipes, plan your meals, and prepare your shopping list in one calm, simple place.</p><Link className="primary-button" to="/recipes">Explore recipes <span>→</span></Link></div><div className="hero-card"><span className="hero-emoji">🥕</span><p>What are you cooking today?</p><div className="mini-recipe"><span>🍜</span><strong>Comfort bowl</strong><small>Ready in 25 min</small></div><div className="mini-recipe"><span>🥗</span><strong>Garden salad</strong><small>Fresh & simple</small></div></div></main>;
}

function RecipesPage() {
  const [recipes, setRecipes] = useState([]); const [search, setSearch] = useState(''); const [category, setCategory] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { const timer = setTimeout(async () => { setLoading(true); try { const params = new URLSearchParams(); if (search.trim()) params.set('search', search.trim()); if (category) params.set('category', category); const { data } = await api.get(`/recipes?${params.toString()}`); setRecipes(data.recipes); setError(''); } catch { setError('Unable to load recipes. Please check that the API is running.'); } finally { setLoading(false); } }, 250); return () => clearTimeout(timer); }, [search, category]);
  const rankedRecipes = [...recipes].sort((a, b) => { const query = search.trim().toLowerCase(); const aStarts = query && a.title.toLowerCase().startsWith(query); const bStarts = query && b.title.toLowerCase().startsWith(query); return Number(bStarts) - Number(aStarts); });
  const suggestions = search.trim() ? rankedRecipes.filter((recipe) => recipe.title.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 5) : [];
  return <main className="page-container content-page"><p className="eyebrow">DISCOVER</p><h1>Recipes</h1><div className="recipe-toolbar"><div className="search-box"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipes..." aria-label="Search recipes" />{suggestions.length > 0 && !loading && <div className="search-suggestions" role="listbox">{suggestions.map((recipe) => <button type="button" key={recipe._id} onClick={() => setSearch(recipe.title)}>{recipe.title}<small>{recipe.category}</small></button>)}</div>}</div><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="">All categories</option><option value="Vietnamese">Vietnamese</option><option value="Italian">Italian</option><option value="Healthy">Healthy</option><option value="Japanese">Japanese</option><option value="Breakfast">Breakfast</option><option value="Vegetarian">Vegetarian</option></select></div>{loading && <p className="muted">Loading recipes...</p>}{error && <p className="form-error">{error}</p>}{!loading && !error && rankedRecipes.length === 0 && <p className="muted">No recipes found.</p>}<div className="recipe-grid">{rankedRecipes.map((recipe) => <Link className="recipe-card" to={`/recipes/${recipe._id}`} key={recipe._id}><div className="recipe-image">🍲</div><div className="recipe-card-body"><span className="recipe-category">{recipe.category}</span><h2>{recipe.title}</h2><p>{recipe.description}</p><small>{recipe.prepTime + recipe.cookTime} min · {recipe.servings} servings</small></div></Link>)}</div></main>;
}

function RecipeDetailPage() {
  const { id } = useParams(); const [recipe, setRecipe] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.get(`/recipes/${id}`).then(({ data }) => setRecipe(data.recipe)).catch(() => setError('Recipe not found.')).finally(() => setLoading(false)); }, [id]);
  if (loading) return <main className="page-container content-page"><p className="muted">Loading recipe...</p></main>;
  if (error) return <main className="page-container content-page"><p className="form-error">{error}</p><Link to="/recipes">← Back to recipes</Link></main>;
  return <main className="page-container detail-page"><Link className="back-link" to="/recipes">← Back to recipes</Link><p className="eyebrow">{recipe.category}</p><h1>{recipe.title}</h1><p className="detail-description">{recipe.description}</p><div className="detail-meta"><span>{recipe.prepTime + recipe.cookTime} min total</span><span>{recipe.servings} servings</span></div><section className="detail-section"><h2>Ingredients</h2><ul>{recipe.ingredients.map((ingredient) => <li key={`${ingredient.name}-${ingredient.quantity}`}><span>{ingredient.name}</span><strong>{ingredient.quantity}</strong></li>)}</ul></section><section className="detail-section"><h2>Instructions</h2><ol>{recipe.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></section></main>;
}

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

  return <main className="page-container auth-page"><p className="eyebrow">COOKMATE ACCOUNT</p><h1>{register ? 'Create your account' : 'Welcome back'}</h1><form className="auth-form" onSubmit={handleSubmit}>{register && <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}<label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input required minLength={register ? 8 : 1} pattern={register ? '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$' : undefined} title={register ? 'Use at least 8 characters with uppercase, lowercase, and a number' : undefined} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={register ? '8+ chars, upper/lowercase and number' : 'Your password'} /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading} type="submit">{loading ? 'Please wait...' : register ? 'Create account' : 'Log in'}</button></form></main>;
}

function App() { return <Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/recipes" element={<RecipesPage />} /><Route path="/recipes/:id" element={<RecipeDetailPage />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /></Routes></Layout>; }

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></StrictMode>);
