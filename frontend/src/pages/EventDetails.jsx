import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

import { Calendar, MapPin, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { getImageUrl } from '../utils/imageUrl';

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/evenements/${id}`);
        // Normaliser les noms de variables attendus par la vue s'il le faut
        const data = response.data;
        // On s'assure que "categories" existe (Laravel renvoie "categories_billets")
        data.categories = data.categories_billets || []; 
        setEvent(data);
      } catch (error) {
        console.error("Erreur de récupération des détails :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleQuantityChange = (categoryId, change) => {
    setSelectedTickets(prev => {
      const current = prev[categoryId] || 0;
      const newValue = Math.max(0, current + change);
      return { ...prev, [categoryId]: newValue };
    });
  };

  const handleAddToCart = (category) => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: location, 
          message: "Veuillez vous connecter pour continuer votre réservation." 
        } 
      });
      return;
    }

    const qty = selectedTickets[category.id] || 0;
    if (qty > 0) {
      addToCart(category, event, qty);
      // Reset after adding
      setSelectedTickets(prev => ({ ...prev, [category.id]: 0 }));
      // Could show a toast notification here
      toast.success("Billets ajoutés au panier !");
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', textAlign: 'center' }}>
         <p className="text-secondary" style={{ fontSize: '1.25rem' }}>Chargement des détails...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', minHeight: 'calc(100vh - 80px)', textAlign: 'center' }}>
         <p className="text-secondary" style={{ fontSize: '1.25rem' }}>Événement introuvable.</p>
         <Link to="/" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem', minHeight: 'calc(100vh - 80px)' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}
            onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} 
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
        <ArrowLeft size={18} />
        Retour au catalogue
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Banner */}
        <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', height: '400px', position: 'relative' }}>
          <img src={getImageUrl(event.image_url)} alt={event.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(10,10,15,1), transparent)' }}></div>
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <span className="event-category" style={{ background: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', color: 'white', display: 'inline-block', marginBottom: '1rem' }}>Concert</span>
            <h1 className="heading-1" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{event.titre}</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Main Content */}
          <div className="animate-fade-in delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-2" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>À propos de l'événement</h2>
              <p className="text-secondary" style={{ lineHeight: '1.6' }}>{event.description}</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-2" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Informations Pratiques</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <Calendar size={24} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Date et Heure</h4>
                    <p className="text-secondary" style={{ textTransform: 'capitalize' }}>{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <MapPin size={24} color="var(--accent-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Lieu</h4>
                    <p className="text-secondary">{event.lieu.nom}</p>
                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{event.lieu.adresse}, {event.lieu.ville}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection Sidebar */}
          <div className="animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 className="heading-2" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Réservation</h2>
            
            {event.categories.map((category) => (
              <div key={category.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{category.libelle}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      {category.quantite_restante > 20 ? (
                        <span style={{ color: '#10b981' }}>Disponible</span>
                      ) : category.quantite_restante > 0 ? (
                        <span style={{ color: '#f59e0b' }}>Plus que {category.quantite_restante} places</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>Complet</span>
                      )}
                    </p>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {category.prix.toLocaleString()} FCFA
                  </div>
                </div>
                
                {category.quantite_restante > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                        onClick={() => handleQuantityChange(category.id, -1)}
                        disabled={(selectedTickets[category.id] || 0) <= 0}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span style={{ fontSize: '1.2rem', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                        {selectedTickets[category.id] || 0}
                      </span>
                      
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                        onClick={() => handleQuantityChange(category.id, 1)}
                        disabled={(selectedTickets[category.id] || 0) >= Math.min(10, category.quantite_restante)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className="btn-primary" 
                      onClick={() => handleAddToCart(category)}
                      disabled={(selectedTickets[category.id] || 0) <= 0}
                      style={{ opacity: (selectedTickets[category.id] || 0) > 0 ? 1 : 0.5 }}
                    >
                      Ajouter
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
              <Info size={18} className="text-secondary" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                Les billets sont nominatifs. Maximum 10 billets par commande et par personne. Les mineurs doivent être accompagnés.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
