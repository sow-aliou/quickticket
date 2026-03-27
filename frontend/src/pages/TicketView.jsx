import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateString, includeTime = true) => {
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

const TicketView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // On récupère la commande spécifique
        const response = await api.get(`/commandes/${id}`);
        setOrder(response.data.data || response.data);
      } catch {
        setError("Impossible de charger les billets. Ils n'existent peut-être plus ou vous n'y avez pas accès.");
      } finally {
        setLoading(false);
      }
    };
    if (user && id) {
      fetchOrder();
    }
  }, [user, id]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page { size: auto; margin: 0mm; }
        body * { visibility: hidden; }
        #printable-area, #printable-area * { visibility: visible; }
        #printable-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
        .no-print { display: none !important; }
        .ticket-page { page-break-after: always; padding: 2cm !important; margin: 0 !important; background: white !important; box-shadow: none !important; color: black !important; }
        .ticket-page * { color: black !important; border-color: #ddd !important; }
        .glass-bg-override { background: white !important; }
        /* Force dark text for printing */
        h1, h2, h3, h4, p, span, div { color: #000 !important; }
        .qr-bg { background: white !important; padding: 10px; border-radius: 8px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '1.5rem' }}>
        <Loader2 size={48} className="animate-spin text-accent" />
        <span className="text-secondary">Génération de vos billets...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={64} style={{ color: '#ef4444', margin: '0 auto 1.5rem' }} />
        <h2 className="heading-2">Billet introuvable</h2>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>{error}</p>
        <Link to="/dashboard" className="btn-secondary">Retour au tableau de bord</Link>
      </div>
    );
  }

  const { evenement, billets } = order;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem' }}>
      
      {/* Control Bar (No Print) */}
      <div className="container no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Retour
        </Link>
        <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Imprimer les billets
        </button>
      </div>

      {/* Printable Area */}
      <div id="printable-area" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        {billets?.map((ticket, index) => (
          <div key={ticket.id} className="ticket-page glass-panel" style={{ 
            width: '100%', maxWidth: '800px', padding: '0', overflow: 'hidden', 
            background: 'var(--glass-bg)', display: 'flex', flexDirection: 'column',
            border: '1px solid var(--glass-border)', position: 'relative'
          }}>
            
            {/* Ticket Header */}
            <div style={{ background: 'var(--accent-primary)', padding: '1.5rem 2rem', color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.05em', margin: 0 }}>QuickTicket</h2>
                 <p style={{ margin: 0, fontWeight: '600', opacity: 0.8, fontSize: '0.9rem' }}>BILLET OFFICIEL</p>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Catégorie</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{ticket.categorie?.libelle || "STANDARD"}</h3>
               </div>
            </div>

            {/* Ticket Body */}
            <div style={{ display: 'flex', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
              
              {/* Event Info */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                  {evenement?.titre}
                </h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Date & Heure</div>
                   <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>{formatDate(evenement?.date)}</div>
                   
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Lieu</div>
                   <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>
                     {evenement?.lieu?.nom}<br/>
                     <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '400' }}>{evenement?.lieu?.adresse}, {evenement?.lieu?.ville}</span>
                   </div>

                   <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Titulaire</div>
                   <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>{user?.name}</div>
                </div>
              </div>

              {/* QR Code Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '200px', borderLeft: '2px dashed var(--glass-border)', paddingLeft: '2rem' }}>
                 <div className="qr-bg" style={{ background: 'white', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem' }}>
                   <QRCodeSVG 
                     value={`QT-${order.reference}-${ticket.code_unique}`} 
                     size={160} 
                     level="H"
                     includeMargin={true}
                   />
                 </div>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.1em', margin: 0 }}>
                    #{ticket.code_unique}
                 </p>
                 <p style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.5rem', textAlign: 'center' }}>
                    SÉCURISÉ &amp; ENREGISTRÉ
                 </p>
              </div>

            </div>

            {/* Ticket Footer */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Billet {index + 1} sur {billets.length}</span>
              <span>Commande: {order.reference || order.id} • Emis le {new Date(order.created_at).toLocaleDateString()}</span>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
};

export default TicketView;
