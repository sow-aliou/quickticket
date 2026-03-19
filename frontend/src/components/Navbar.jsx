import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    transition: 'var(--transition)',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontWeight: isActive ? '600' : '400',
    position: 'relative',
    padding: '0.5rem 0'
  });

  const activeIndicator = (isActive) => isActive ? {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: '0',
    width: '100%',
    height: '2px',
    background: 'var(--accent-gradient)',
    borderRadius: 'var(--radius-full)'
  } : {};

  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logos/quickticket-logo.png" alt="QuickTicket" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
          <span translate="no" style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            {settings.site_name ? (
              settings.site_name.includes(' ') ? (
                <>
                  {settings.site_name.split(' ')[0]}<span className="text-gradient"> {settings.site_name.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                <span className="text-gradient">{settings.site_name}</span>
              )
            ) : (
              <>Quick<span className="text-gradient">Ticket</span></>
            )}
          </span>

        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {!isAdminPath && (
            <>
              <NavLink to="/" style={navLinkStyle}>
                {({ isActive }) => (
                  <span style={{ position: 'relative' }}>
                    Catalogue
                    <span style={activeIndicator(isActive)}></span>
                  </span>
                )}
              </NavLink>

              {/* "Mes Billets" uniquement si connecté */}
              {isAuthenticated && (
                <NavLink to="/mes-billets" style={navLinkStyle} >
                  {({ isActive }) => (
                    <span style={{ position: 'relative' }}>
                      Mes Billets
                      <span style={activeIndicator(isActive)}></span>
                    </span>
                  )}
                </NavLink>
              )}
            </>
          )}

          {/* Lien Admin uniquement si admin et pas déjà sur admin */}
          {isAdmin && !isAdminPath && (
            <Link to="/admin" className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'var(--transition)', color: 'var(--accent-secondary)' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', alignItems: 'center' }}>
            {/* Panier uniquement si connecté et pas sur admin */}
            {isAuthenticated && !isAdminPath && (
              <Link to="/panier" className="btn-secondary" style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
                  <User size={16} className="text-accent" />
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
                  {isAdmin && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--accent-gradient)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', color: 'white', fontWeight: '700', letterSpacing: '0.05em' }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }} title="Se déconnecter">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ marginRight: '0.5rem' }} />
                Connexion
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
