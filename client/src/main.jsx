import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import api from './lib/api.js';
import './styles.css';

function Layout({ children }) {
  const { user, logout } = useAuth();
  return <div className="site-shell"><header className="navbar"><Link className="brand" to="/">CookMate</Link><nav className="nav-links"><Link to="/recipes">Recipes</Link><Link to="/ingredient-search">By ingredients</Link>{user ? <><Link to="/submit-recipe">Submit recipe</Link><Link to="/my-submissions">My submissions</Link><Link to="/meal-planner">Meal plan</Link><Link to="/shopping-list">Shopping list</Link>{user.role === 'admin' && <><Link to="/admin/review">Review queue</Link><Link to="/admin/recipes">Manage</Link></>}<span className="user-greeting">Hi, {user.name}</span><button className="logout-button" type="button" onClick={logout}>Log out</button></> : <><Link to="/login">Log in</Link><Link className="nav-cta" to="/register">Get started</Link></>}</nav></header>{children}<footer className="footer">CookMate · Plan better, cook happier.</footer></div>;
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

function IngredientSearchPage() {
  const { token } = useAuth();
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [addingRecipeId, setAddingRecipeId] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/recipes/ingredients')
      .then(({ data }) => { if (active) setAvailableIngredients(data.ingredients); })
      .catch(() => { if (active) setError('Unable to load ingredient suggestions. You can still type an ingredient manually.'); })
      .finally(() => { if (active) setLoadingIngredients(false); });
    return () => { active = false; };
  }, []);

  function addIngredient(event) {
    event.preventDefault();
    const name = input.trim().replace(/\s+/g, ' ');
    if (!name) return;
    if (selectedIngredients.some((item) => item.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setInput('');
      return;
    }
    if (selectedIngredients.length >= 30) {
      setError('You can add up to 30 ingredients.');
      return;
    }
    setSelectedIngredients((current) => [...current, name]);
    setInput('');
    setMatches([]);
    setHasSearched(false);
    setMessage('');
    setError('');
  }

  async function findMatches(event) {
    event.preventDefault();
    if (!selectedIngredients.length) {
      setError('Add at least one ingredient to find matching recipes.');
      return;
    }
    setSearching(true);
    setHasSearched(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/recipes/match', { ingredients: selectedIngredients });
      setMatches(data.recipes);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to find matching recipes. Please try again.');
    } finally {
      setSearching(false);
    }
  }

  async function addMissingIngredients(match) {
    setAddingRecipeId(match.recipe._id);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/shopping-list', { items: match.missingIngredients });
      setMessage(data.count
        ? `Added ${data.count} missing ingredient${data.count === 1 ? '' : 's'} for ${match.recipe.title}.`
        : `All missing ingredients for ${match.recipe.title} are already on your shopping list.`);
    } catch (requestError) {
      setError(requestError.response?.status === 401
        ? 'Your session has expired. Please log in again to update the shopping list.'
        : requestError.response?.data?.message || 'Unable to update your shopping list.');
    } finally {
      setAddingRecipeId('');
    }
  }

  return <main className="page-container content-page ingredient-search-page">
    <p className="eyebrow">COOK WITH WHAT YOU HAVE</p>
    <h1>Find recipes by ingredients</h1>
    <p className="muted ingredient-search-intro">Choose or type ingredients you already have. CookMate will show what each recipe matches and what is still missing.</p>
    <form className="ingredient-picker" onSubmit={addIngredient}>
      <label htmlFor="ingredient-input">Your ingredients</label>
      <div className="ingredient-input-row">
        <input id="ingredient-input" list="recipe-ingredient-options" value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. tomato, rice, chicken" maxLength={100} />
        <datalist id="recipe-ingredient-options">{availableIngredients.map((ingredient) => <option key={ingredient} value={ingredient} />)}</datalist>
        <button className="secondary-button" type="submit">Add ingredient</button>
      </div>
      {loadingIngredients && <p className="muted">Loading suggestions...</p>}
      {!!selectedIngredients.length && <ul className="ingredient-chips" aria-label="Selected ingredients">{selectedIngredients.map((ingredient) => <li className="ingredient-chip" key={ingredient}><span>{ingredient}</span><button type="button" aria-label={`Remove ${ingredient}`} onClick={() => { setSelectedIngredients((current) => current.filter((item) => item !== ingredient)); setMatches([]); }}>×</button></li>)}</ul>}
      <button className="primary-button" type="button" onClick={findMatches} disabled={searching || !selectedIngredients.length}>{searching ? 'Finding recipes...' : 'Find matching recipes'}</button>
    </form>
    {error && <p className="form-error" role="alert">{error}</p>}
    {message && <p className="success-message" role="status">{message} {token && <Link to="/shopping-list">View shopping list →</Link>}</p>}
    {!searching && matches.length === 0 && !hasSearched && selectedIngredients.length > 0 && <p className="muted">Choose “Find matching recipes” to see suggestions.</p>}
    {!searching && matches.length === 0 && !error && hasSearched && selectedIngredients.length > 0 && <p className="muted">No matching recipes yet. Try adding another ingredient.</p>}
    {!!matches.length && <section className="ingredient-results" aria-live="polite"><h2>Matching recipes <span className="muted">({matches.length})</span></h2>{matches.map((match) => <article className="ingredient-match-card" key={match.recipe._id}>
      <div className="ingredient-match-heading"><div><span className="recipe-category">{match.recipe.category}</span><h3><Link to={`/recipes/${match.recipe._id}`}>{match.recipe.title}</Link></h3><p>{match.matchCount} of {match.totalIngredients} ingredients available</p></div><Link className="text-link" to={`/recipes/${match.recipe._id}`}>View recipe →</Link></div>
      <div className="ingredient-groups"><div><h4>Have</h4><ul>{match.matchedIngredients.map((item) => <li key={`${item.name}-${item.quantity}`}>{item.name} <span>{item.quantity}</span></li>)}</ul></div><div><h4>Missing</h4>{match.missingIngredients.length ? <ul>{match.missingIngredients.map((item) => <li key={`${item.name}-${item.quantity}`}>{item.name} <span>{item.quantity}</span></li>)}</ul> : <p className="muted">You have everything for this recipe.</p>}</div></div>
      {match.missingIngredients.length > 0 && (token
        ? <button className="secondary-button" type="button" disabled={Boolean(addingRecipeId)} onClick={() => addMissingIngredients(match)}>{addingRecipeId === match.recipe._id ? 'Adding...' : 'Add missing items to shopping list'}</button>
        : <p className="muted"> <Link to="/login">Log in</Link> to add missing items to your shopping list.</p>)}
    </article>)}</section>}
  </main>;
}

function RecipeDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loadedRecipeKey, setLoadedRecipeKey] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState('');
  const [favoriteState, setFavoriteState] = useState({ key: '', isFavorite: false, loading: false, error: '' });
  const recipeKey = `${id}:${retryCount}`;
  const favoriteKey = `${user?.id || 'anonymous'}:${id}`;
  const loading = loadedRecipeKey !== recipeKey;
  const isFavorite = favoriteState.key === favoriteKey && favoriteState.isFavorite;
  const favoriteLoading = Boolean(token) && (favoriteState.key !== favoriteKey || favoriteState.loading);
  const favoriteError = favoriteState.key === favoriteKey ? favoriteState.error : '';

  useEffect(() => {
    let active = true;
    api.get(`/recipes/${id}`)
      .then(({ data }) => {
        if (active) {
          setRecipe(data.recipe);
          setError('');
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setRecipe(null);
        setError(requestError.response?.status === 404 ? 'Recipe not found.' : 'Unable to load recipe. Please try again.');
      })
      .finally(() => {
        if (active) setLoadedRecipeKey(recipeKey);
      });
    return () => { active = false; };
  }, [id, recipeKey]);

  useEffect(() => {
    let active = true;
    if (!token) return () => { active = false; };
    api.get('/favorites')
      .then(({ data }) => {
        if (active) {
          setFavoriteState({
            key: favoriteKey,
            isFavorite: data.favorites.some((favorite) => favorite.recipe?._id === id || favorite.recipe === id),
            loading: false,
            error: '',
          });
        }
      })
      .catch((requestError) => {
        if (active) setFavoriteState({ key: favoriteKey, isFavorite: false, loading: false, error: requestError.response?.data?.message || 'Unable to load favorite status.' });
      });
    return () => { active = false; };
  }, [favoriteKey, id, token]);

  async function toggleFavorite() {
    if (!token) {
      setFavoriteState({ key: favoriteKey, isFavorite: false, loading: false, error: 'Please log in to save favorites.' });
      return;
    }
    setFavoriteState((current) => ({ key: favoriteKey, isFavorite: current.key === favoriteKey && current.isFavorite, loading: true, error: '' }));
    try {
      if (isFavorite) await api.delete(`/favorites/${id}`);
      else await api.post(`/favorites/${id}`, {});
      setFavoriteState({ key: favoriteKey, isFavorite: !isFavorite, loading: false, error: '' });
    } catch (requestError) {
      setFavoriteState({ key: favoriteKey, isFavorite, loading: false, error: requestError.response?.data?.message || 'Unable to update favorite.' });
    }
  }

  if (loading) return <main className="page-container content-page"><p className="muted">Loading recipe...</p></main>;
  if (error) return <main className="page-container content-page"><p className="form-error">{error}</p>{error !== 'Recipe not found.' && <button className="secondary-button" type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button>}<p><Link to="/recipes">← Back to recipes</Link></p></main>;
  if (!recipe) return <main className="page-container content-page"><p className="form-error">Recipe not found.</p><Link to="/recipes">← Back to recipes</Link></main>;
  return <main className="page-container detail-page"><Link className="back-link" to="/recipes">← Back to recipes</Link><p className="eyebrow">{recipe.category}</p><h1>{recipe.title}</h1><p className="detail-description">{recipe.description}</p><div className="detail-meta"><span>{recipe.prepTime + recipe.cookTime} min total</span><span>{recipe.servings} servings</span></div><button className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} type="button" onClick={toggleFavorite} disabled={favoriteLoading}>{favoriteLoading ? 'Updating...' : isFavorite ? '♥ Saved to favorites' : '♡ Save to favorites'}</button>{favoriteError && <p className="form-error">{favoriteError}</p>}<section className="detail-section"><h2>Ingredients</h2><ul>{recipe.ingredients.map((ingredient) => <li key={`${ingredient.name}-${ingredient.quantity}`}><span>{ingredient.name}</span><strong>{ingredient.quantity}</strong></li>)}</ul></section><section className="detail-section"><h2>Instructions</h2><ol>{recipe.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol></section></main>;
}

const emptySubmission = { title: '', description: '', category: 'Vietnamese', prepTime: 0, cookTime: 0, servings: 2, ingredients: '', instructions: '' };

function SubmitRecipePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptySubmission);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submitRecipe(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    const ingredientLines = form.ingredients.split('\n').map((line) => line.trim()).filter(Boolean);
    const ingredients = ingredientLines.map((line) => {
      const [name, ...quantityParts] = line.split('|');
      return { name: name.trim(), quantity: quantityParts.join('|').trim() };
    });
    if (ingredients.length === 0 || ingredients.some((item) => !item.name || !item.quantity)) {
      setError('Enter each ingredient as name|quantity, with one ingredient per line.');
      return;
    }
    const instructions = form.instructions.split('\n').map((line) => line.trim()).filter(Boolean);
    if (instructions.length === 0) {
      setError('Add at least one instruction step.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      prepTime: Number(form.prepTime),
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      ingredients,
      instructions,
    };
    try {
      await api.post('/recipes/submissions', payload);
      setForm(emptySubmission);
      setMessage('Recipe submitted. It will be published after admin approval.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit recipe. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <main className="page-container content-page"><p className="form-error">Log in to submit a recipe.</p><Link to="/login">Go to login →</Link></main>;
  return <main className="page-container content-page"><p className="eyebrow">SHARE A FAVORITE</p><h1>Submit a recipe</h1><p className="muted submission-intro">Your recipe stays private until an admin reviews and approves it.</p><form className="recipe-admin-form" onSubmit={submitRecipe}>
    <label className="field-label">Recipe title<input required maxLength="120" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
    <label className="field-label">Category<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
    <label className="field-label">Description<textarea required maxLength="500" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
    <div className="form-row"><label className="field-label">Prep time (minutes)<input min="0" type="number" value={form.prepTime} onChange={(event) => setForm({ ...form, prepTime: event.target.value })} /></label><label className="field-label">Cook time (minutes)<input min="0" type="number" value={form.cookTime} onChange={(event) => setForm({ ...form, cookTime: event.target.value })} /></label><label className="field-label">Servings<input min="1" type="number" value={form.servings} onChange={(event) => setForm({ ...form, servings: event.target.value })} /></label></div>
    <label className="field-label">Ingredients, one per line: name|quantity<textarea required value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} placeholder={'Beef|200g\nRice noodles|150g'} /></label>
    <label className="field-label">Instructions, one step per line<textarea required value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message} <Link to="/my-submissions">Check submission status →</Link></p>}
    <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit for review'}</button>
  </form></main>;
}

function MySubmissionsPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!user) return () => { active = false; };
    api.get('/recipes/submissions/mine').then(({ data }) => { if (active) setRecipes(data.recipes); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load your submissions.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]);

  if (!user) return <main className="page-container content-page"><p className="form-error">Log in to view your submissions.</p><Link to="/login">Go to login →</Link></main>;
  return <main className="page-container content-page"><p className="eyebrow">YOUR CONTRIBUTIONS</p><h1>My submissions</h1>{loading && <p className="muted">Loading submissions...</p>}{error && <p className="form-error">{error}</p>}{!loading && !error && recipes.length === 0 && <p className="muted">You have not submitted any recipes yet.</p>}<div className="submission-list">{recipes.map((recipe) => <article className="submission-card" key={recipe._id}><div className="submission-card-heading"><div><span className={`status-badge status-${recipe.status}`}>{recipe.status}</span><h2>{recipe.title}</h2><p>{recipe.category} · Submitted {new Date(recipe.createdAt).toLocaleDateString()}</p></div>{recipe.status === 'approved' && <Link className="text-link" to={`/recipes/${recipe._id}`}>View published recipe →</Link>}</div>{recipe.status === 'rejected' && recipe.reviewNote && <p className="review-note"><strong>Admin feedback:</strong> {recipe.reviewNote}</p>}</article>)}</div></main>;
}

function AdminReviewPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadQueue() {
    const { data } = await api.get('/recipes/review-queue');
    setRecipes(data.recipes);
  }

  useEffect(() => {
    let active = true;
    if (user?.role !== 'admin') return () => { active = false; };
    api.get('/recipes/review-queue').then(({ data }) => { if (active) setRecipes(data.recipes); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load the review queue.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]);

  async function review(id, status) {
    setSavingId(id);
    setError('');
    setMessage('');
    try {
      await api.patch(`/recipes/${id}/review`, { status, reviewNote: notes[id] || '' });
      setRecipes((current) => current.filter((recipe) => recipe._id !== id));
      setMessage(status === 'approved' ? 'Recipe approved and published.' : 'Recipe rejected; the submitter can see your feedback.');
      setNotes((current) => { const next = { ...current }; delete next[id]; return next; });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to review this recipe.');
      try { await loadQueue(); } catch { /* Keep the original request error visible. */ }
    } finally {
      setSavingId('');
    }
  }

  if (user?.role !== 'admin') return <main className="page-container content-page"><p className="form-error">Admin access required.</p><Link to="/recipes">Back to recipes →</Link></main>;
  return <main className="page-container content-page"><p className="eyebrow">ADMIN TOOLS</p><h1>Review recipes</h1>{loading && <p className="muted">Loading review queue...</p>}{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}{!loading && !error && recipes.length === 0 && <p className="muted">No recipes are waiting for review.</p>}<div className="submission-list">{recipes.map((recipe) => <article className="review-card" key={recipe._id}><div className="submission-card-heading"><div><span className="status-badge status-pending">pending</span><h2>{recipe.title}</h2><p>{recipe.category} · Submitted by {recipe.createdBy?.name || recipe.createdBy?.email || 'User'}</p></div><span className="muted">{new Date(recipe.createdAt).toLocaleDateString()}</span></div><p>{recipe.description}</p><section><h3>Ingredients</h3><ul>{recipe.ingredients.map((item) => <li key={`${item.name}-${item.quantity}`}>{item.name} — {item.quantity}</li>)}</ul></section><section><h3>Instructions</h3><ol>{recipe.instructions.map((step) => <li key={step}>{step}</li>)}</ol></section><label className="field-label">Feedback (optional for rejection)<textarea maxLength="500" value={notes[recipe._id] || ''} onChange={(event) => setNotes((current) => ({ ...current, [recipe._id]: event.target.value }))} placeholder="Suggest what the author should change" /></label><div className="form-actions"><button className="primary-button" type="button" disabled={Boolean(savingId)} onClick={() => review(recipe._id, 'approved')}>{savingId === recipe._id ? 'Saving...' : 'Approve and publish'}</button><button className="secondary-button reject-button" type="button" disabled={Boolean(savingId)} onClick={() => review(recipe._id, 'rejected')}>Reject</button></div></article>)}</div></main>;
}

function MealPlannerPage() {
  const { token } = useAuth(); const [plans, setPlans] = useState([]); const [recipes, setRecipes] = useState([]); const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), mealType: 'dinner', recipeId: '' }); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  async function loadData() { if (!token) { setLoading(false); return; } setLoading(true); setError(''); try { const [plansResponse, recipesResponse] = await Promise.all([api.get('/meal-plans'), api.get('/recipes')]); setPlans(plansResponse.data.mealPlans); setRecipes(recipesResponse.data.recipes); setForm((current) => ({ ...current, recipeId: current.recipeId || recipesResponse.data.recipes[0]?._id || '' })); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load meal planner.'); } finally { setLoading(false); } }
  useEffect(() => { let active = true; if (token) Promise.all([api.get('/meal-plans'), api.get('/recipes')]).then(([plansResponse, recipesResponse]) => { if (!active) return; setPlans(plansResponse.data.mealPlans); setRecipes(recipesResponse.data.recipes); setForm((current) => ({ ...current, recipeId: current.recipeId || recipesResponse.data.recipes[0]?._id || '' })); }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load meal planner.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [token]);
  async function addPlan(event) { event.preventDefault(); setError(''); try { await api.post('/meal-plans', form); await loadData(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to add meal plan.'); } }
  async function removePlan(id) { setError(''); try { await api.delete(`/meal-plans/${id}`); setPlans((current) => current.filter((plan) => plan._id !== id)); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to remove meal plan.'); } }
  if (!token) return <main className="page-container content-page"><p className="form-error">Please log in to use the meal planner.</p><Link to="/login">Go to login →</Link></main>;
  return <main className="page-container content-page"><p className="eyebrow">PLAN AHEAD</p><h1>Meal planner</h1><form className="planner-form" onSubmit={addPlan}><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /><select value={form.mealType} onChange={(event) => setForm({ ...form, mealType: event.target.value })}><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select><select required value={form.recipeId} onChange={(event) => setForm({ ...form, recipeId: event.target.value })}><option value="">Choose a recipe</option>{recipes.map((recipe) => <option key={recipe._id} value={recipe._id}>{recipe.title}</option>)}</select><button className="primary-button" type="submit">Add meal</button></form>{error && <p className="form-error">{error}</p>}{loading && <p className="muted">Loading meal plans...</p>}{!loading && plans.length === 0 && <p className="muted">No meals planned yet.</p>}<div className="plan-list">{plans.map((plan) => <article className="plan-card" key={plan._id}><div><span className="recipe-category">{plan.mealType}</span><h2>{plan.recipe?.title || 'Recipe unavailable'}</h2><p>{plan.date}</p></div><button className="text-button" type="button" onClick={() => removePlan(plan._id)}>Remove</button></article>)}</div></main>;
}

function ShoppingListPage() {
  const { token } = useAuth(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; if (token) api.get('/shopping-list').then(({ data }) => { if (active) setItems(data.items); }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load shopping list.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [token]);
  async function generateList() { setError(''); try { const { data } = await api.post('/shopping-list/generate'); setItems(data.items); } catch (requestError) { setError(requestError.response?.data?.message || 'Add a meal plan before generating a list.'); } }
  async function toggleItem(item) { setError(''); try { const { data } = await api.patch(`/shopping-list/${item._id}`, { checked: !item.checked }); setItems((current) => current.map((currentItem) => currentItem._id === item._id ? data.item : currentItem)); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update shopping item.'); } }
  async function removeItem(id) { setError(''); try { await api.delete(`/shopping-list/${id}`); setItems((current) => current.filter((item) => item._id !== id)); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to remove shopping item.'); } }
  if (!token) return <main className="page-container content-page"><p className="form-error">Please log in to use the shopping list.</p><Link to="/login">Go to login →</Link></main>;
  return <main className="page-container content-page"><p className="eyebrow">SHOP SMART</p><h1>Shopping list</h1><div className="list-actions"><button className="primary-button" type="button" onClick={generateList}>Generate from meal plan</button><span className="muted">{items.filter((item) => !item.checked).length} items left</span></div>{error && <p className="form-error">{error}</p>}{loading && <p className="muted">Loading shopping list...</p>}{!loading && items.length === 0 && <p className="muted">Your shopping list is empty. Generate it from your meal plan.</p>}<div className="shopping-list">{items.map((item) => <article className={`shopping-item ${item.checked ? 'is-checked' : ''}`} key={item._id}><label><input type="checkbox" checked={item.checked} onChange={() => toggleItem(item)} /><span>{item.name}</span></label><strong>{item.quantity}</strong><button className="text-button" type="button" onClick={() => removeItem(item._id)}>Remove</button></article>)}</div></main>;
}

function RecipeManagementPage() {
  const { user } = useAuth(); const [recipes, setRecipes] = useState([]); const [loadedForUser, setLoadedForUser] = useState(''); const [editingId, setEditingId] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const [deletingId, setDeletingId] = useState(''); const emptyForm = { title: '', description: '', category: 'Vietnamese', prepTime: 0, cookTime: 0, servings: 2, ingredients: '', instructions: '' }; const [form, setForm] = useState(emptyForm);
  const loading = user?.role === 'admin' && loadedForUser !== user.id;
  async function loadRecipes() { const { data } = await api.get('/recipes'); setRecipes(data.recipes); }
  useEffect(() => { let active = true; if (user?.role !== 'admin') return () => { active = false; }; api.get('/recipes').then(({ data }) => { if (active) { setRecipes(data.recipes); setError(''); } }).catch(() => { if (active) setError('Unable to load recipes. Please try again.'); }).finally(() => { if (active) setLoadedForUser(user.id); }); return () => { active = false; }; }, [user]);
  function updateField(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function editRecipe(recipe) { setEditingId(recipe._id); setForm({ ...recipe, ingredients: recipe.ingredients.map((item) => `${item.name}|${item.quantity}`).join('\n'), instructions: recipe.instructions.join('\n') }); setMessage(''); }
  async function saveRecipe(event) { event.preventDefault(); setError(''); setMessage(''); setSaving(true); const payload = { ...form, prepTime: Number(form.prepTime), cookTime: Number(form.cookTime), servings: Number(form.servings), ingredients: form.ingredients.split('\n').filter(Boolean).map((line) => { const [name, quantity] = line.split('|'); return { name: name.trim(), quantity: (quantity || '').trim() }; }), instructions: form.instructions.split('\n').filter(Boolean).map((line) => line.trim()) }; try { if (editingId) await api.patch(`/recipes/${editingId}`, payload); else await api.post('/recipes', payload); setForm(emptyForm); setEditingId(null); setMessage('Recipe saved successfully.'); try { await loadRecipes(); } catch { setError('Recipe saved, but the list could not be refreshed. Reload the page to see the latest recipes.'); } } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save recipe.'); } finally { setSaving(false); } }
  async function deleteRecipe(id) { if (!window.confirm('Delete this recipe?')) return; setError(''); setMessage(''); setDeletingId(id); try { await api.delete(`/recipes/${id}`); setRecipes((current) => current.filter((recipe) => recipe._id !== id)); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete recipe.'); } finally { setDeletingId(''); } }
  if (!user || user.role !== 'admin') return <main className="page-container content-page"><p className="form-error">Admin access required.</p><Link to="/recipes">Back to recipes →</Link></main>;
  if (loading) return <main className="page-container content-page"><p className="muted">Loading recipes...</p></main>;
  return <main className="page-container content-page"><p className="eyebrow">ADMIN TOOLS</p><h1>Manage recipes</h1><form className="recipe-admin-form" onSubmit={saveRecipe}><input required name="title" value={form.title} onChange={updateField} placeholder="Recipe title" /><input required name="category" value={form.category} onChange={updateField} placeholder="Category" /><textarea required name="description" value={form.description} onChange={updateField} placeholder="Short description" /><div className="form-row"><label className="field-label">Prep time (minutes)<input min="0" name="prepTime" type="number" value={form.prepTime} onChange={updateField} placeholder="e.g. 15" /></label><label className="field-label">Cook time (minutes)<input min="0" name="cookTime" type="number" value={form.cookTime} onChange={updateField} placeholder="e.g. 30" /></label><label className="field-label">Servings<input min="1" name="servings" type="number" value={form.servings} onChange={updateField} placeholder="e.g. 2" /></label></div><textarea required name="ingredients" value={form.ingredients} onChange={updateField} placeholder={'Ingredients, one per line: name|quantity'} /><textarea required name="instructions" value={form.instructions} onChange={updateField} placeholder="Instructions, one per line" /><div className="form-actions"><button className="primary-button" disabled={saving} type="submit">{saving ? 'Saving...' : editingId ? 'Update recipe' : 'Create recipe'}</button>{editingId && <button className="secondary-button" type="button" disabled={saving} onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}</div></form>{message && <p className="success-message">{message}</p>}{error && <p className="form-error">{error}</p>}{!error && recipes.length === 0 && <p className="muted">No recipes yet. Create the first one above.</p>}<div className="admin-recipe-list">{recipes.map((recipe) => <article className="admin-recipe-row" key={recipe._id}><div><strong>{recipe.title}</strong><small>{recipe.category}</small></div><div><button className="text-button" type="button" disabled={Boolean(deletingId)} onClick={() => editRecipe(recipe)}>Edit</button><button className="text-button" type="button" disabled={Boolean(deletingId)} onClick={() => deleteRecipe(recipe._id)}>{deletingId === recipe._id ? 'Deleting...' : 'Delete'}</button></div></article>)}</div></main>;
}

function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(searchParams.get('expired') ? 'Your session expired. Please log in again.' : '');
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

function App() { return <Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/recipes" element={<RecipesPage />} /><Route path="/ingredient-search" element={<IngredientSearchPage />} /><Route path="/recipes/:id" element={<RecipeDetailPage />} /><Route path="/submit-recipe" element={<SubmitRecipePage />} /><Route path="/my-submissions" element={<MySubmissionsPage />} /><Route path="/admin/review" element={<AdminReviewPage />} /><Route path="/meal-planner" element={<MealPlannerPage />} /><Route path="/shopping-list" element={<ShoppingListPage />} /><Route path="/admin/recipes" element={<RecipeManagementPage />} /><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /></Routes></Layout>; }

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></StrictMode>);
