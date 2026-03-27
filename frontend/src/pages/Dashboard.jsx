import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, Ticket, CheckCircle2, Loader2, AlertCircle, ShoppingBag, MapPin, Clock } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const formatDate = (dateString, includeTime = false) => {
  const date = new Date(dateString);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  return date.toLocaleDateString('fr-FR', options);
};

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/commandes');
        setOrders(response.data.data || response.data || []);
      } catch (err) {
        setError("Impossible de charger vos commandes. Veuillez réessayer.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);


  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
        <div className="animate-slide-up">
          <h1 className="heading-1" style={{ fontSize: '2.8rem', marginBottom: '0.75rem', fontWeight: '800' }}>
            Mes <span className="text-gradient">Billets</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
            Bienvenue, <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.name}</span>. Retrouvez ici vos accès pour vos événements favoris.
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '6rem', gap: '1.5rem' }}>
          <div className="relative">
             <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', boxShadow: '0 0 25px var(--accent-primary)', opacity: 0.3 }}></div>
          </div>
          <span className="text-secondary" style={{ fontSize: '1.1rem', fontWeight: '500' }}>Récupération de vos précieux sésames...</span>
        </div>
      )}

      {!loading && error && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertCircle size={32} style={{ color: '#ef4444' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Oups ! Une erreur est survenue</h2>
          <p style={{ color: '#fca5a5', marginBottom: '2rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">Réessayer</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="glass-panel animate-slide-up" style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom, var(--glass-bg), rgba(16, 185, 129, 0.02))' }}>
          <div className="floating" style={{ marginBottom: '2rem' }}>
            <ShoppingBag size={80} style={{ color: 'var(--accent-primary)', opacity: 0.4 }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Votre collection est vide</h2>
          <p className="text-secondary" style={{ marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Vous n'avez pas encore de billets réservés. Ne manquez pas les meilleurs événements du moment au Sénégal !
          </p>
          <Link to="/catalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: 'var(--radius-full)' }}>
            <Ticket size={20} /> Explorer le catalogue
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {orders.map((order, idx) => (
            <div key={order.id} className={`glass-panel animate-slide-up`} style={{ padding: 0, overflow: 'hidden', animationDelay: `${idx * 100}ms` }}>
              
              {/* Order Card Layout */}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                
                {/* Event Image Side */}
                <div style={{ width: '100%', maxWidth: '300px', position: 'relative', minHeight: '200px' }}>
                  <img 
                    src={getImageUrl(order.evenement?.image_url)} 
                    alt="" 
                    onError={(e) => {
                      e.target.src = '/logos/quickticket-logo.png';
                      e.target.style.objectFit = 'contain';
                      e.target.style.padding = '2rem';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'rgba(255,255,255,0.03)' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--bg-secondary))' }}></div>
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                     <span style={{ 
                       background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', 
                       padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', 
                       fontSize: '0.75rem', fontWeight: '700', color: 'white',
                       border: '1px solid rgba(255,255,255,0.1)'
                     }}>
                       {formatDate(order.evenement?.date).split(' ')[0].toUpperCase()}
                     </span>
                  </div>
                </div>

                {/* Right Side Content */}
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', minWidth: '320px' }}>
                  
                  {/* Info Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>COMMANDE #{order.reference || order.id}</span>
                        {(order.statut === 'paye' || order.statut === 'payé' || order.statut === 'completed') && (
                          <span style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.35rem', 
                            color: '#10b981', fontSize: '0.75rem', fontWeight: '600',
                            background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.6rem', 
                            borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' 
                          }}>
                            <CheckCircle2 size={12} /> Confirmé
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.2' }}>{order.evenement?.titre}</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
                          {formatDate(order.evenement?.date)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <MapPin size={16} style={{ color: 'var(--accent-secondary)' }} />
                          {order.evenement?.lieu?.nom || 'Lieu exceptionnel'} — {order.evenement?.lieu?.ville}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>MONTANT TOTAL</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {Number(order.montant_total).toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* Tickets List Sub-section */}
                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Vos Billets ({order.billets?.length || 0})
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                           Le {new Date(order.created_at).toLocaleDateString()}
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {order.billets?.map((ticket) => (
                          <div key={ticket.id} style={{ 
                            padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '12px',
                            border: '1px solid var(--glass-border)', display: 'flex',
                            justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <div>
                               <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--accent-primary)' }}>
                                 {ticket.categorie?.libelle || "Billet Standard"}
                               </div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                                 {ticket.code_unique || `QKT-${ticket.id}`}
                               </div>
                            </div>
                             <Link 
                               to={`/billet/${order.id}`}
                               className="btn-secondary" 
                               title="Ouvrir le billet avec QR Code"
                               style={{ padding: '0.5rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                             >
                                <Ticket size={18} />
                             </Link>
                          </div>
                        ))}
                     </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

