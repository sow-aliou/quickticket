import { AlertTriangle } from 'lucide-react';

const DeleteConfirm = ({ item, type, onCancel, onConfirm, loading }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
      <AlertTriangle size={48} style={{ color: '#f59e0b', margin: '0 auto 1rem' }} />
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Confirmer la suppression</h2>
      <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Élément : <strong style={{ color: 'white' }}>"{item?.titre || item?.nom}"</strong>. Cette action est irréversible.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={onCancel} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Annuler</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: '0.75rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600' }} disabled={loading}>
          {loading ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
