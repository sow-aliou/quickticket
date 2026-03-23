import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Maintenance = () => {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <AlertTriangle size={40} color="#fbbf24" />
        </div>
        
        <h1 className="heading-1" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          Site en <span className="text-gradient">Maintenance</span>
        </h1>
        
        <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          Nous effectuons actuellement des mises à jour pour améliorer votre expérience. 
          Revenez très bientôt pour réserver vos billets !
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} /> Rafraîchir
          </Link>
          <a href="mailto:support@quickticket.sn" className="btn-secondary">
            Nous contacter
          </a>
        </div>
        
        <div style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Merci de votre patience. L'équipe QuickTicket.
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
