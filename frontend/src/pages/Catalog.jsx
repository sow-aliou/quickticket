import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import api from '../api';
import { getImageUrl } from '../utils/imageUrl';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString('fr-FR', { day: '2-digit' });
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });
  return { day, month };
};

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('toutes');
  const [sortOption, setSortOption] = useState('date_asc');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  
  // États pour les filtres
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/evenements');
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  let filtered = events.filter(event => {
    const matchesSearchTerm = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (event.lieu?.ville && event.lieu.ville.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtre "Afficher événements complets"
    const hideSoldOut = settings.show_sold_out === '0';
    const isSoldOut = parseInt(event.total_restant) <= 0;
    const matchesSoldOut = !hideSoldOut || !isSoldOut;

    // Filtre par date
    let matchesDate = true;
    if (event.date) {
      const eventDate = new Date(event.date);
      const today = new Date();
      if (dateFilter === 'week-end') {
        const dayOfWeek = eventDate.getDay();
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesDate = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) && diffDays >= 0 && diffDays <= 7;
      } else if (dateFilter === 'mois') {
        matchesDate = eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearchTerm && matchesSoldOut && matchesDate;
  });

  // Tri
  filtered.sort((a, b) => {
    if (sortOption === 'date_asc') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === 'prix_asc') {
      return a.prix_min - b.prix_min;
    } else if (sortOption === 'prix_desc') {
      return b.prix_min - a.prix_min;
    }
    return 0;
  });

  const filteredEvents = filtered;

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="text-secondary" style={{ fontSize: '1.25rem' }}>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Header Section */}
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="heading-1" style={{ marginBottom: '1rem' }}>
          Découvrez des événements <span className="text-gradient">exceptionnels</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Réservez vos places pour les meilleurs concerts, spectacles et événements sportifs près de chez vous.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="glass-panel animate-fade-in delay-100" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
          <Search size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un événement, un artiste, une ville..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem 1rem 1rem 3rem', 
              background: 'rgba(0, 0, 0, 0.2)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
          >
            <option value="toutes" style={{ background: '#0f172a' }}>Toutes les dates</option>
            <option value="week-end" style={{ background: '#0f172a' }}>Ce week-end</option>
            <option value="mois" style={{ background: '#0f172a' }}>Ce mois-ci</option>
          </select>

          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
          >
            <option value="date_asc" style={{ background: '#0f172a' }}>Date (Croissant)</option>
            <option value="prix_asc" style={{ background: '#0f172a' }}>Prix (Croissant)</option>
            <option value="prix_desc" style={{ background: '#0f172a' }}>Prix (Décroissant)</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid-auto">
          {filteredEvents.map((event, index) => {
            const { day, month } = formatDate(event.date);
            
            return (
              <div key={event.id} className={`glass-panel event-card animate-fade-in`} style={{ animationDelay: `${0.1 * (index + 2)}s` }}>
                <div className="event-image-container">
                  <img 
                    src={getImageUrl(event.image_url)} 
                    alt="" 
                    onError={(e) => {
                      e.target.src = '/logos/quickticket-logo.png';
                      e.target.style.objectFit = 'contain';
                      e.target.style.padding = '2rem';
                    }}
                    className="event-image" 
                  />
                  <div className="event-date-badge">
                    <span className="day">{day}</span>
                    <span className="month">{month}</span>
                  </div>
                </div>
                
                <div className="event-body">
                  <span className="event-category">Événement</span>
                  <h3 className="event-title">{event.titre}</h3>
                  
                  <div className="event-location">
                    <MapPin size={16} className="text-muted" />
                    <span>{event.lieu.nom}, {event.lieu.ville}</span>
                  </div>
                  
                  <div className="event-footer">
                    <div className="event-price">
                      <span>à partir de </span>
                      {event.prix_min ? event.prix_min.toLocaleString() : '0'} FCFA
                    </div>
                    <Link to={`/evenement/${event.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <Calendar size={48 } className="text-muted" style={{ margin: '0 auto 1rem' }} />
          <h3 className="heading-2" style={{ marginBottom: '0.5rem' }}>Aucun événement trouvé</h3>
          <p className="text-secondary">Essayez de modifier vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
