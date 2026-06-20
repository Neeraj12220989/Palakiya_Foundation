import { useEffect, useState } from 'react';
import { Trash2, ImageOff } from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const ManageGallery = () => {
  const { push } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Events' });
  const [image, setImage] = useState({ file: null, url: '' });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('All');

  const load = () =>
    api
      .get('/gallery')
      .then((res) => setImages(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm({ title: '', category: 'Events' });
    setImage({ file: null, url: '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!image.file && !image.url) {
      push('Please provide an image', 'error');
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('category', form.category);
      if (image.file) data.append('image', image.file);
      else data.append('image', image.url);

      await api.post('/gallery', data);
      push('Image added');
      setModal(false);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to upload', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/gallery/${confirm.id}`);
      push('Image deleted');
      setConfirm(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const categories = ['All', ...new Set(images.map((i) => i.category))];
  const filtered = filter === 'All' ? images : images.filter((i) => i.category === filter);

  return (
    <div>
      <PageTitle
        title="Gallery"
        subtitle="Upload and organise images by category."
        actionLabel="Add Image"
        onAction={openNew}
      />

      {!loading && categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === c ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-ink-400">
          <ImageOff size={36} />
          <p className="mt-3 text-sm">No images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img) => (
            <div key={img.id} className="card group relative overflow-hidden">
              <img src={img.image} alt={img.title || ''} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink-900/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => setConfirm(img)}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white"
                >
                  <Trash2 size={15} />
                </button>
                <div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                    {img.category}
                  </span>
                  {img.title && <p className="mt-1 truncate text-xs text-white">{img.title}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Gallery Image">
        <form onSubmit={handleSave} className="space-y-4">
          <ImageField value={image.url} onChange={setImage} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title (optional)</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                placeholder="Health camp 2024"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {['Events', 'Campaigns', 'Field Work'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Uploading...' : 'Add Image'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this image? This cannot be undone."
      />
    </div>
  );
};

export default ManageGallery;
