import { useState, useEffect } from 'react';
import { Settings, Users, CalendarDays, Plus, Edit2, Trash2, MapPin, Search, TrendingUp, BarChart2, Save, List, Ticket, DollarSign, Users as UsersIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { getImageUrl } from '../utils/imageUrl';
import VenueModal from '../components/admin/VenueModal';
import EventModal from '../components/admin/EventModal';
import DeleteConfirm from '../components/admin/DeleteConfirm';

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
  color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
};
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' };


// ─── Main Admin Dashboard ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [settings, setSettings] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, tickets_sold: 0, users_count: 0, active_events: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { item, type }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evRes, lieuRes, statsRes, settingsRes] = await Promise.all([
        api.get('/admin/evenements'),
        api.get('/lieux'),
        api.get('/stats'),
        api.get('/settings'),
      ]);

      // Handle potential wrappings
      setEvents(Array.isArray(evRes.data) ? evRes.data : (evRes.data.data || []));
      setLieux(Array.isArray(lieuRes.data) ? lieuRes.data : (lieuRes.data.data || []));
      setStats(statsRes.data);
      setSettings(Array.isArray(settingsRes.data) ? settingsRes.data : (settingsRes.data.data || settingsRes.data || []));
    } catch (err) {
      console.error('Erreur chargement données admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventSave = (saved, isNew) => {
    fetchData(); // Plus simple de tout recharger pour les stats
  };

  const handleVenueSave = (saved, isNew) => {
    fetchData();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      const { item, type } = deletingItem;
      const endpoint = type === 'event' ? `/evenements/${item.id}` : `/lieux/${item.id}`;
      await api.delete(endpoint);
      fetchData();
      setDeletingItem(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.post('/settings/batch', { settings });
      toast.success('Paramètres enregistrés avec succès');
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const filteredEvents = events.filter(e =>
    e.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.lieu?.nom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLieux = lieux.filter(l =>
    l.ville?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.adresse?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sideTabStyle = (tab) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    background: activeTab === tab ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
    color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
    border: activeTab === tab ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
    cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem',
    fontWeight: activeTab === tab ? '600' : '400',
    transition: 'var(--transition)', width: '100%'
  });

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Modals */}
      {showEventModal && (
        <EventModal
          lieux={lieux}
          event={editingEvent}
          onClose={() => { setShowEventModal(false); setEditingEvent(null); }}
          onSave={handleEventSave}
        />
      )}
      {showVenueModal && (
        <VenueModal
          venue={editingVenue}
          onClose={() => { setShowVenueModal(false); setEditingVenue(null); }}
          onSave={handleVenueSave}
        />
      )}
      {deletingItem && (
        <DeleteConfirm
          item={deletingItem.item}
          type={deletingItem.type}
          onCancel={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

      {/* Header compact */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1 animate-fade-in" style={{ fontSize: '1.8rem' }}>
            Panneau <span className="text-gradient">Administrateur</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {activeTab === 'dashboard' ? 'Vue d\'ensemble de la plateforme' :
              activeTab === 'events' ? 'Créez et gérez vos événements' :
              activeTab === 'venues' ? 'Gérez vos lieux et salles' :
                    'Configuration générale du site'}
          </p>
        </div>
        {(activeTab === 'events' || activeTab === 'venues') && (
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => {
              if (activeTab === 'events') { setEditingEvent(null); setShowEventModal(true); }
              else { setEditingVenue(null); setShowVenueModal(true); }
            }}
          >
            <Plus size={18} />
            {activeTab === 'events' ? 'Nouvel Événement' : 'Nouveau Lieu'}
          </button>
        )}
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 220px) 1fr', gap: '2rem' }}>
        {/* Sidebar améliorée */}
        <div className="glass-panel animate-fade-in delay-100" style={{ padding: '1.25rem', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: '100px' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0.5rem 1rem', marginBottom: '0.25rem', fontWeight: '600' }}>Navigation</div>
          <button onClick={() => setActiveTab('dashboard')} style={sideTabStyle('dashboard')}><BarChart2 size={18} />Dashboard</button>
          <button onClick={() => setActiveTab('events')} style={sideTabStyle('events')}><CalendarDays size={18} />Événements</button>
          <button onClick={() => setActiveTab('venues')} style={sideTabStyle('venues')}><MapPin size={18} />Lieux</button>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }} />
          <button onClick={() => setActiveTab('settings')} style={sideTabStyle('settings')}><Settings size={18} />Paramètres</button>
        </div>

        {/* Main content Area */}
        <div className="animate-fade-in delay-200">

          {/* === ONGLET DASHBOARD === */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Chiffre d'Affaires</div>
                      <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.revenue.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>FCFA</span></div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                      <DollarSign size={24} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                    <TrendingUp size={14} /> Revenus totaux
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #06b6d4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Billets Vendus</div>
                      <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.tickets_sold}</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}>
                      <Ticket size={24} style={{ color: '#06b6d4' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tous événements confondus</div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Utilisateurs</div>
                      <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.users_count}</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}>
                      <UsersIcon size={24} style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Inscrits sur la plateforme</div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Événements</div>
                      <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.active_events}</div>
                    </div>
                    <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                      <CalendarDays size={24} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Actifs actuellement</div>
                </div>
              </div>

              {/* Événements récents */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>Événements récents</h3>
                  <button onClick={() => setActiveTab('events')} style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                      <img src={getImageUrl(event.image_url)} alt={event.titre} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.titre}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(event.date).toLocaleDateString('fr-FR')} — {event.lieu?.nom}</div>
                      </div>
                      <div style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem', flexShrink: 0 }}>
                        {event.prix_min ? `${Number(event.prix_min).toLocaleString()} FCFA` : 'Gratuit'}
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && <div className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>Aucun événement créé</div>}
                </div>
              </div>
            </div>
          )}


          {/* Onglets events/venues/users/settings dans un glass-panel */}
          {activeTab !== 'dashboard' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                  {activeTab === 'events' ? 'Gestion des événements' :
                    activeTab === 'venues' ? 'Gestion des lieux' :
                      'Paramètres du site'}
                </h2>
                {activeTab !== 'settings' && (
                  <div style={{ position: 'relative', width: '240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                    />
                  </div>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
                  <Loader2 size={40} className="animate-spin text-accent" />
                  <span className="text-secondary">Chargement des données...</span>
                </div>
              ) : activeTab === 'events' ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Image</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Titre</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Date & Lieu</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Ventes</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Revenus</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Restant</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map(event => (
                        <tr key={event.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <img
                              src={getImageUrl(event.image_url)}
                              alt={event.titre}
                              style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                            />
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{event.titre}</td>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                            <div>{new Date(event.date).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.8rem' }}>{event.lieu?.nom}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <UsersIcon size={14} className="text-accent" />
                              <span style={{ fontWeight: '600' }}>{event.billets_vendus || 0}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                            {event.chiffre_affaire ? `${Number(event.chiffre_affaire).toLocaleString()} FCFA` : '0 FCFA'}
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{ 
                              color: event.billets_restants < 10 ? '#ef4444' : 'var(--text-secondary)',
                              fontWeight: event.billets_restants < 10 ? '600' : '400'
                            }}>
                              {event.billets_restants || 0}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => {
                                api.get(`/evenements/${event.id}`).then(res => {
                                  setEditingEvent(res.data);
                                  setShowEventModal(true);
                                });
                              }}><Edit2 size={15} /></button>
                              <button className="btn-secondary" style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => setDeletingItem({ item: event, type: 'event' })}><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === 'venues' ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Nom</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Ville / Adresse</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Capacité</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLieux.map(venue => (
                        <tr key={venue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{venue.nom}</td>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                            <div>{venue.ville}</div>
                            <div style={{ fontSize: '0.8rem' }}>{venue.adresse}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>{venue.capacite.toLocaleString()}</td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={() => { setEditingVenue(venue); setShowVenueModal(true); }}><Edit2 size={15} /></button>
                              <button className="btn-secondary" style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => setDeletingItem({ item: venue, type: 'venue' })}><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <form onSubmit={handleUpdateSettings}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Champs texte en grille */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      {settings.filter(s => s.type !== 'boolean' && s.key !== 'service_fee').map(s => (
                        <div key={s.key}>
                          <label style={labelStyle}>{s.label}</label>
                          <input
                            style={inputStyle}
                            value={s.value || ''}
                            onChange={(e) => handleSettingChange(s.key, e.target.value)}
                            type={['service_fee', 'max_tickets_per_order'].includes(s.key) ? 'number' : 'text'}
                            placeholder="..."
                          />
                        </div>
                      ))}
                    </div>

                    {/* Séparateur */}
                    {settings.filter(s => s.type === 'boolean').length > 0 && (
                      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '600' }}>
                          Fonctionnalités
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {settings.filter(s => s.type === 'boolean').map(s => (
                            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                              <span style={{ fontWeight: '500' }}>{s.label}</span>
                              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', flexShrink: 0, cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={s.value === '1'}
                                  onChange={(e) => handleSettingChange(s.key, e.target.checked ? '1' : '0')}
                                  style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                  background: s.value === '1' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                                  borderRadius: '26px', transition: '0.3s'
                                }}>
                                  <span style={{
                                    position: 'absolute', height: '18px', width: '18px',
                                    left: s.value === '1' ? '26px' : '4px', top: '4px',
                                    background: 'white', borderRadius: '50%', transition: '0.3s'
                                  }} />
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }} disabled={savingSettings}>
                      {savingSettings ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
