import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', textAlign: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'var(--glass-bg)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <ShoppingBag size={40} className="text-secondary" />
          </div>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Votre panier est vide</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            Vous n'avez pas encore sélectionné de billets pour un événement.
          </p>
          <Link to="/" className="btn-primary">
            Découvrir les événements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem', minHeight: 'calc(100vh - 80px)' }}>
      <h1 className="heading-1 animate-fade-in" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
        Votre <span className="text-gradient">Panier</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-panel animate-fade-in delay-100" style={{ padding: '0', overflow: 'hidden' }}>
          {cart.map((item, index) => (
            <div key={item.categoryId} style={{ 
              display: 'flex', 
              padding: '1.5rem', 
              borderBottom: index !== cart.length - 1 ? '1px solid var(--glass-border)' : 'none',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                <img 
                  src={getImageUrl(item.image_url)} 
                  alt="" 
                  onError={(e) => {
                    e.target.src = '/logos/quickticket-logo.png';
                    e.target.style.objectFit = 'contain';
                    e.target.style.padding = '0.5rem';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <span className="text-secondary" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                  {item.eventTitle}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.categoryLabel}</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {item.price.toLocaleString()} FCFA <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/ unité</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-full)' }}>
                  <button 
                    style={{ padding: '0.25rem', borderRadius: '50%', color: 'inherit' }}
                    onClick={() => updateQuantity(item.categoryId, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    style={{ padding: '0.25rem', borderRadius: '50%', color: 'inherit' }}
                    onClick={() => updateQuantity(item.categoryId, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div style={{ fontSize: '1.25rem', fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.categoryId)}
                  style={{ color: '#ef4444', padding: '0.5rem', marginLeft: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary side or bottom based on grid logic - currently stack style instead of sidebary */}
        <div className="glass-panel animate-fade-in delay-200" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', marginLeft: 'auto' }}>
          <h2 className="heading-2" style={{ fontSize: '1.5rem' }}>Résumé de la commande</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span>Sous-total ({getCartCount()} billets)</span>
            <span>{getCartTotal().toLocaleString()} FCFA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span>Frais de service (inclus)</span>
            <span>0 FCFA</span>
          </div>
          
          <div style={{ height: '1px', background: 'var(--glass-border)' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>Total</span>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              {getCartTotal().toLocaleString()} FCFA
            </span>
          </div>
          
          <Link to="/checkout" className="btn-primary" style={{ marginTop: '1rem', width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
            <CreditCard size={20} />
            Procéder au paiement
            <ArrowRight size={20} style={{ marginLeft: 'auto' }} />
          </Link>
          
          <p className="text-secondary" style={{ fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Paiement 100% sécurisé via Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
