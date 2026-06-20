import { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Circle, CheckCircle2, Inbox } from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const formatDate = (d) =>
  new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const ManageContacts = () => {
  const { push } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api
      .get('/contacts')
      .then((res) => setContacts(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const open = async (c) => {
    setSelected(c);
    if (!c.read) {
      try {
        await api.patch(`/contacts/${c.id}/read`);
        setContacts((list) => list.map((x) => (x.id === c.id ? { ...x, read: true } : x)));
      } catch {
        /* ignore */
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/contacts/${confirm.id}`);
      push('Message deleted');
      setConfirm(null);
      setSelected(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div>
      <PageTitle
        title="Messages"
        subtitle={`${contacts.length} total • ${unread} unread`}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-ink-400">
          <Inbox size={36} />
          <p className="mt-3 text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => open(c)}
              className={`flex w-full items-center gap-4 p-4 text-left transition hover:bg-ink-50 ${
                !c.read ? 'bg-brand-50/40' : ''
              }`}
            >
              <span className="shrink-0">
                {c.read ? (
                  <CheckCircle2 size={16} className="text-ink-300" />
                ) : (
                  <Circle size={16} className="fill-brand-500 text-brand-500" />
                )}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-sm font-bold text-white">
                {c.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate ${!c.read ? 'font-extrabold' : 'font-semibold'} text-ink-900`}>
                    {c.name}
                  </p>
                  <span className="shrink-0 text-xs text-ink-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="truncate text-sm text-ink-500">
                  {c.subject ? <span className="font-semibold">{c.subject} — </span> : null}
                  {c.message}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message Details">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-lg font-bold text-white">
                {selected.name.charAt(0)}
              </span>
              <div>
                <p className="font-extrabold text-ink-900">{selected.name}</p>
                <p className="text-xs text-ink-400">{formatDate(selected.createdAt)}</p>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl bg-ink-50 p-4 text-sm sm:grid-cols-2">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-ink-600 hover:text-brand-600">
                <Mail size={16} /> {selected.email}
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-ink-600 hover:text-brand-600">
                  <Phone size={16} /> {selected.phone}
                </a>
              )}
            </div>
            {selected.subject && (
              <div>
                <p className="label">Subject</p>
                <p className="text-sm font-semibold text-ink-900">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="label">Message</p>
              <p className="whitespace-pre-line rounded-xl border border-ink-100 p-4 text-sm leading-relaxed text-ink-600">
                {selected.message}
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <a href={`mailto:${selected.email}`} className="btn-secondary">
                <Mail size={16} /> Reply
              </a>
              <button
                onClick={() => setConfirm(selected)}
                className="btn !bg-red-50 text-red-600 hover:!bg-red-100"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete message from ${confirm?.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageContacts;
