import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer style={{ 
      background: 'rgba(10, 10, 15, 0.9)', 
      backdropFilter: 'blur(10px)', 
      borderTop: '1px solid var(--glass-border)',
      padding: '4rem 1.5rem 2rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Brand & Mission */}
          <div>
            <Link to="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              textDecoration: 'none', 
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '1.5rem'
            }}>
              {settings.site_name ? (
                settings.site_name.includes(' ') ? (
                  <>
                    {settings.site_name.split(' ')[0]}<span style={{ color: 'var(--accent-primary)' }}> {settings.site_name.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--accent-primary)' }}>{settings.site_name}</span>
                )
              ) : (
                <>Quick<span style={{ color: 'var(--accent-primary)' }}>Ticket</span></>
              )}
            </Link>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              La plateforme de billetterie numéro 1 au Sénégal. Réservez vos événements préférés en quelques clics, en toute sécurité.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <a href={settings.facebook_link || "#"} className="social-icon" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
              <a href={settings.instagram_link || "#"} className="social-icon" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href={settings.twitter_link || "#"} className="social-icon" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Exploration</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" className="footer-link">Catalogue</Link></li>
              <li><Link to="/mes-billets" className="footer-link">Mes Billets</Link></li>
              <li><Link to="/panier" className="footer-link">Mon Panier</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>{settings.physical_address || "Dakar, Sénégal"}</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Phone size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>{settings.contact_phone || "+221 33 000 00 00"}</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>{settings.contact_email || "contact@quickticket.sn"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} {settings.site_name || "QuickTicket"}. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Design avec ❤️ au Sénégal</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
          display: inline-block;
          font-size: 0.95rem;
        }
        .footer-link:hover {
          color: var(--accent-primary);
          transform: translateX(5px);
        }
        .social-icon {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: 1px solid var(--glass-border);
        }
        .social-icon:hover {
          color: var(--accent-primary);
          background: rgba(16, 185, 129, 0.1);
          border-color: var(--accent-primary);
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
