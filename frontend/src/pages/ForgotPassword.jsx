import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugToken, setDebugToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.debug_token) {
        setDebugToken(response.data.debug_token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>
        <h1 className="heading-1" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Mot de passe oublié ?</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {message && (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid var(--accent-primary)', color: 'var(--accent-primary)', marginBottom: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.sn"
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                  color: 'white', outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
            {!loading && <Send size={18} />}
          </button>
        </form>

        {debugToken && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              [DEBUG] Lien de simulation :
            </p>
            <Link to={`/reset-password/${debugToken}?email=${email}`} style={{ fontSize: '0.8rem', color: 'white', wordBreak: 'break-all' }}>
              Cliquer ici pour réinitialiser
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
