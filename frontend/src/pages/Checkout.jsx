import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api';

const PAYMENT_METHODS = [
  { 
    id: 'wave', 
    name: 'Wave', 
    color: '#1E90FF', 
    logo: '/logos/wave.jpg',
    instruction: 'Une demande de confirmation apparaîtra dans votre application Wave.'
  },
  { 
    id: 'orange', 
    name: 'Orange Money', 
    color: '#FF6600', 
    logo: '/logos/orange-money.png',
    instruction: 'Composez le #144#77# pour confirmer le paiement sur votre mobile.'
  },
  { 
    id: 'mixx', 
    name: 'Mixx by Yas', 
    color: '#1B2E6B', 
    logo: '/logos/mixx.png',
    instruction: 'Utilisez votre application Mixx by Yas pour confirmer le paiement.'
  }
];

const Checkout = () => {
  const { getCartTotal, cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'validating', 'success'
  const [error, setError] = useState(null);

  if (cart.length === 0 && step !== 'success') {
    navigate('/panier');
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      setError("Veuillez saisir un numéro de téléphone valide.");
      return;
    }

    setError(null);
    setStep('validating');

    // Simulation de l'attente de validation mobile
    console.log(`Simulation de paiement via ${selectedMethod} pour le numéro ${phoneNumber}`);
    
    setTimeout(async () => {
      try {
        // Enregistrement de la commande en base de données
        await api.post('/commandes', {
          total: getCartTotal(),
          items: cart.map(item => ({
            categoryId: item.categoryId,
            quantity: item.quantity
          }))
        });

        setStep('success');
        clearCart();
      } catch (err) {
        console.error("Erreur commande:", err);
        setError("Une erreur est survenue lors de la validation. Veuillez réessayer.");
        setStep('form');
      }
    }, 4000); // 4 secondes pour simuler la validation sur téléphone
  };

  if (step === 'success') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} color="#10b981" />
          </div>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Paiement Confirmé !</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            Votre paiement via <strong>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</strong> a été validé avec succès. 
            Vos billets ont été générés et sont disponibles dans votre espace "Mes Billets".
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/mes-billets')} className="btn-primary">
              Voir mes billets
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Retour au catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'validating') {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel animate-pulse" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <Smartphone size={64} className="text-accent" style={{ marginBottom: '2rem' }} />
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Validation en cours...</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.instruction}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Loader2 className="animate-spin" size={24} />
            <span>En attente de confirmation sur votre mobile</span>
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
            Ne fermez pas cette page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem', minHeight: 'calc(100vh - 80px)' }}>
      <button 
        onClick={() => navigate('/panier')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={18} />
        Retour au panier
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }} className="responsive-grid">
        
        {/* Left Side: Payment Form */}
        <div className="animate-fade-in">
          <h1 className="heading-1" style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
            Finalisez votre <span className="text-gradient">Commande</span>
          </h1>
          <p className="text-secondary" style={{ marginBottom: '2.5rem' }}>
            Choisissez votre méthode de paiement mobile préférée.
          </p>

          <form onSubmit={handlePayment} className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Méthode de paiement</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {PAYMENT_METHODS.map(method => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedMethod === method.id ? method.color : 'var(--glass-border)'}`,
                    background: selectedMethod === method.id ? `${method.color}15` : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <img src={method.logo} alt={method.name} style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '8px' }} />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{method.name}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Numéro de téléphone
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  +221
                </span>
                <input 
                  type="tel" 
                  placeholder="77 000 00 00" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 4rem', 
                    background: 'rgba(0, 0, 0, 0.2)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: '1.1rem',
                    outline: 'none'
                  }}
                />
              </div>
              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', justifyContent: 'center' }}
            >
              Payer {getCartTotal().toLocaleString()} FCFA
            </button>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Transaction sécurisée via SSL
            </p>
          </form>
        </div>

        {/* Right Side: Summary (Order Summary) */}
        <div className="glass-panel animate-fade-in delay-100" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 className="heading-2" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Récapitulatif</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.categoryId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: '500' }}>{item.quantity}x {item.categoryLabel}</span>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.eventTitle}</div>
                </div>
                <span style={{ fontWeight: '600' }}>{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
          
          <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '1.5rem' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              {getCartTotal().toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>FCFA</span>
            </span>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>
              <CheckCircle size={14} />
              <span>Génération instantanée des billets</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Une fois le paiement validé, vos billets seront immédiatement disponibles dans votre compte.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
          .glass-panel {
            max-width: 100% !important;
          }
        }
      `}} />
    </div>
  );
};

export default Checkout;
