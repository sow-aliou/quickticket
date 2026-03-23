import { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../api';

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
  color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
};
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' };

const VenueModal = ({ onClose, onSave, venue }) => {
  const editing = !!venue;
  const [form, setForm] = useState({
    nom: venue?.nom || '',
    adresse: venue?.adresse || '',
    ville: venue?.ville || '',
    capacite: venue?.capacite || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/lieux/${venue.id}`, form);
        onSave(res.data, false);
      } else {
        const res = await api.post('/lieux', form);
        onSave(res.data, true);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '450px', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={22} />
        </button>
        <h2 className="heading-2" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {editing ? '✏️ Modifier le lieu' : '📍 Nouveau lieu'}
        </h2>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', marginBottom: '1rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nom du lieu *</label>
            <input style={inputStyle} value={form.nom} onChange={handleChange('nom')} required placeholder="Ex: Grand Théâtre National" />
          </div>
          <div>
            <label style={labelStyle}>Adresse *</label>
            <input style={inputStyle} value={form.adresse} onChange={handleChange('adresse')} required placeholder="Ex: Place de l'Indépendance" />
          </div>
          <div>
            <label style={labelStyle}>Ville *</label>
            <input style={inputStyle} value={form.ville} onChange={handleChange('ville')} required placeholder="Ex: Dakar" />
          </div>
          <div>
            <label style={labelStyle}>Capacité totale *</label>
            <input type="number" style={inputStyle} value={form.capacite} onChange={handleChange('capacite')} required placeholder="Ex: 1800" />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Annuler</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={saving}>
              <Save size={16} />
              {saving ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer le lieu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueModal;
