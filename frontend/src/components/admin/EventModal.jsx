import { useState } from 'react';
import { X, Save, Plus, Trash2, Ticket } from 'lucide-react';
import api from '../../api';

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
  color: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
};
const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' };

// ─── Modal for Event (with Ticket Categories) ──────────────────────────
const EventModal = ({ onClose, onSave, event, lieux }) => {
  const editing = !!event;
  const [form, setForm] = useState({
    titre: event?.titre || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().substring(0, 16) : '',
    lieu_id: event?.lieu_id || (lieux[0]?.id || ''),
    categories_billets: event?.categories_billets || [{ libelle: 'Standard', prix: '', quantite_totale: '' }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(event?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const newCats = [...form.categories_billets];
    newCats[index][field] = value;
    setForm(f => ({ ...f, categories_billets: newCats }));
  };

  const addCategory = () => {
    setForm(f => ({
      ...f,
      categories_billets: [...f.categories_billets, { libelle: '', prix: '', quantite_totale: '' }]
    }));
  };

  const removeCategory = (index) => {
    if (form.categories_billets.length > 1) {
      setForm(f => ({
        ...f,
        categories_billets: f.categories_billets.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Utilisation de FormData pour pouvoir envoyer le fichier image
      const formData = new FormData();
      formData.append('titre', form.titre);
      formData.append('description', form.description);
      formData.append('date', new Date(form.date).toISOString());
      formData.append('lieu_id', form.lieu_id);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      form.categories_billets.forEach((cat, i) => {
        if (cat.id) formData.append(`categories_billets[${i}][id]`, cat.id);
        formData.append(`categories_billets[${i}][libelle]`, cat.libelle);
        formData.append(`categories_billets[${i}][prix]`, cat.prix);
        formData.append(`categories_billets[${i}][quantite_totale]`, cat.quantite_totale);
      });

      if (editing) {
        // Laravel ne supporte pas PUT avec FormData, on utilise POST avec _method=PUT
        formData.append('_method', 'PUT');
        const res = await api.post(`/evenements/${event.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onSave(res.data, false);
      } else {
        const res = await api.post('/evenements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onSave(res.data, true);
      }
      onClose();
    } catch (err) {
      const msgs = err.response?.data?.errors ? Object.values(err.response.data.errors).flat() : [];
      setError(msgs[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', zIndex: 10 }}>
          <X size={22} />
        </button>
        <h2 className="heading-2" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {editing ? '✏️ Modifier l\'événement' : '✨ Nouvel événement'}
        </h2>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', marginBottom: '1rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Titre *</label>
              <input style={inputStyle} value={form.titre} onChange={handleChange('titre')} required placeholder="Ex: Concert de Jazz" />
            </div>
            <div>
              <label style={labelStyle}>Date & Heure *</label>
              <input type="datetime-local" style={inputStyle} value={form.date} onChange={handleChange('date')} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Lieu *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.lieu_id} onChange={handleChange('lieu_id')} required>
                <option value="" disabled style={{ background: '#1a1a2e' }}>Choisir un lieu...</option>
                {lieux.map(l => <option key={l.id} value={l.id} style={{ background: '#1a1a2e' }}>{l.nom} ({l.ville})</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Image de l'événement</label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.75rem', border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'rgba(0,0,0,0.15)',
                minHeight: '100px', overflow: 'hidden', position: 'relative',
                transition: 'border-color 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Prévisualisation" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                ) : (
                  <>
                    <span style={{ fontSize: '1.75rem' }}>🖼️</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Cliquez pour choisir une image<br />(JPG, PNG, WEBP, max 4Mo)</span>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.description} onChange={handleChange('description')} placeholder="Décrivez l'événement..." />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={18} className="text-accent" />
                Catégories de billets
              </h3>
              <button type="button" onClick={addCategory} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Plus size={14} /> Ajouter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {form.categories_billets.map((cat, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 40px', gap: '0.5rem', alignItems: 'end' }}>
                  <div>
                    {idx === 0 && <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Libellé</label>}
                    <input style={{ ...inputStyle, padding: '0.5rem' }} value={cat.libelle} onChange={(e) => handleCategoryChange(idx, 'libelle', e.target.value)} required placeholder="VIP, Standard..." />
                  </div>
                  <div>
                    {idx === 0 && <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Prix (FCFA)</label>}
                    <input type="number" style={{ ...inputStyle, padding: '0.5rem' }} value={cat.prix} onChange={(e) => handleCategoryChange(idx, 'prix', e.target.value)} required placeholder="0" />
                  </div>
                  <div>
                    {idx === 0 && <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Quantité</label>}
                    <input type="number" style={{ ...inputStyle, padding: '0.5rem' }} value={cat.quantite_totale} onChange={(e) => handleCategoryChange(idx, 'quantite_totale', e.target.value)} required placeholder="100" />
                  </div>
                  <button type="button" onClick={() => removeCategory(idx)} disabled={form.categories_billets.length === 1} style={{ background: 'none', border: 'none', color: '#ef4444', opacity: form.categories_billets.length === 1 ? 0.3 : 0.8, cursor: 'pointer', paddingBottom: '0.5rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Annuler</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={saving}>
              <Save size={16} />
              {saving ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer l\'événement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
