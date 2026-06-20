import { useEffect, useState } from 'react';
import { Pencil, Trash2, ImageOff, Eye, EyeOff } from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const empty = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Awareness',
  author: 'NGO Team',
  published: true,
  driveLink: '',
};

const ManageArticles = () => {
  const { push } = useToast();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState({ file: null, url: '' });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api
      .get('/articles?includeUnpublished=true')
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setImage({ file: null, url: '' });
    setModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      author: a.author,
      published: a.published,
      driveLink: a.driveLink || '',
    });
    setImage({ file: null, url: a.image || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));

      if (image.file) data.append('image', image.file);
      else if (image.url) data.append('image', image.url);

      if (editing) await api.put(`/articles/${editing.id}`, data);
      else await api.post('/articles', data);

      push(editing ? 'Article updated' : 'Article published');
      setModal(false);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/articles/${confirm.id}`);
      push('Article deleted');
      setConfirm(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Articles & Blogs"
        subtitle="Publish and manage informational posts."
        actionLabel="New Article"
        onAction={openNew}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {a.image ? (
                  <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-ocean-50 px-2 py-0.5 text-xs font-semibold text-ocean-700">
                    {a.category}
                  </span>
                  {a.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                      <Eye size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-400">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
                <h3 className="mt-1 truncate font-bold text-ink-900">{a.title}</h3>
                <p className="truncate text-xs text-ink-500">{a.excerpt}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(a)} className="btn-secondary !px-3 !py-2">
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirm(a)}
                  className="btn !bg-red-50 !px-3 !py-2 text-red-600 hover:!bg-red-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">No articles yet.</p>
          )}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Article' : 'New Article'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Author</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Excerpt *</label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="input resize-none"
              placeholder="A short teaser shown on cards"
            />
          </div>

          <div>
            <label className="label">Content *</label>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input resize-none"
              placeholder="Full article body. Separate paragraphs with new lines."
            />
          </div>

          <ImageField value={image.url} onChange={setImage} label="Cover Image" />

          <div>
            <label className="label">Drive / Detailed URL</label>
            <input
              type="url"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              className="input"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-5 w-5 rounded accent-brand-600"
            />
            <span className="text-sm font-semibold text-ink-700">Published (visible on site)</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageArticles;

