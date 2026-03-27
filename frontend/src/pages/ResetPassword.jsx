import { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialCode = searchParams.get('code') || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/reset-password', {
        code,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setMessage(response.data.message);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat()[0]);
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%' }}>
        
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={60} style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }} />
            <h1 className="heading-1" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Succès !</h1>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              {message || 'Votre mot de passe a été réinitialisé.'}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Redirection vers la page de connexion...
            </p>
            <Link to="/login" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block', width: '100%', textDecoration: 'none', padding: '1rem' }}>
              Se connecter maintenant
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
            <h1 className="heading-1" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Réinitialisation</h1>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Entrez le code reçu par email et votre nouveau mot de passe.
            </p>

            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Adresse Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{ 
                    width: '100%', padding: '0.8rem 1rem', background: 'rgba(0, 0, 0, 0.2)', 
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                    color: 'white', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Code de réinitialisation (6 chiffres)
                </label>
                <input 
                  type="text" 
                  required
                  maxLength="6"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  style={{ 
                    width: '100%', padding: '0.8rem 1rem', background: 'rgba(0, 0, 0, 0.2)', 
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                    color: 'white', outline: 'none', letterSpacing: '0.5rem', textAlign: 'center', fontWeight: 'bold'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Nouveau mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0, 0, 0, 0.2)', 
                      border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                      color: 'white', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Confirmer le mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0, 0, 0, 0.2)', 
                      border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                      color: 'white', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
