import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { settings } = useSettings();

  // Si l'utilisateur venait d'une page protégée, on le redirige après connexion
  const fromPath = location.state?.from?.pathname || location.state?.from;
  const infoMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password };
        
      const response = await api.post(endpoint, payload);
      
      // Enregistrer via le contexte
      login(response.data.user, response.data.token);

      // Redirection selon le rôle ou la page précédente
      if (response.data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (fromPath) {
        navigate(fromPath, { replace: true });
      } else {
        navigate('/mes-billets', { replace: true });
      }
    } catch (err) {
      console.error("Login/Register error:", err.response);
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors[0] || 'Erreur de validation des données.');
      } else {
        setError(err.response?.data?.message || 'Une erreur de connexion est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%' }}>
        <h1 className="heading-1" style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Bon retour' : 'Rejoignez-nous'}
        </h1>
        <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {isLogin ? 'Connectez-vous pour accéder à vos billets' : 'Créez un compte pour réserver vos événements'}
        </p>

        {infoMessage && !error && (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid var(--accent-primary)', color: 'var(--accent-primary)', marginBottom: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '0.9rem' }}>
            {infoMessage}
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', marginBottom: '1.5rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Nom complet
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amadou Diop"
                  style={{ 
                    width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0, 0, 0, 0.2)', 
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                    color: 'white', outline: 'none', transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>
          )}

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
                  color: 'white', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Mot de passe
              </label>
              {isLogin && <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>Oublié ?</Link>}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                  color: 'white', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '1rem', width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {settings.registration_open !== '0' && (
          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold', marginLeft: '0.5rem' }}
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
