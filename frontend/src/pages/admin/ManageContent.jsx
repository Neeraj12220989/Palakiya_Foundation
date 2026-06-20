import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../../api/client.js';
import { useContent } from '../../context/ContentContext.jsx';
import PageTitle from '../../components/admin/PageTitle.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

// Grouped editable fields
const groups = [
  {
    title: 'General',
    fields: [
      { key: 'org_name', label: 'Organisation Name' },
      { key: 'about_intro', label: 'About Intro', textarea: true },
    ],
  },
  {
    title: 'Hero Section',
    fields: [
      { key: 'hero_badge', label: 'Hero Badge' },
      { key: 'hero_title', label: 'Hero Title', textarea: true },
      { key: 'hero_subtitle', label: 'Hero Subtitle', textarea: true },
      { key: 'hero_cta_primary', label: 'Primary Button Text' },
      { key: 'hero_cta_secondary', label: 'Secondary Button Text' },
    ],
  },
  {
    title: 'Impact Statistics',
    fields: [
      { key: 'stat_people', label: 'People Reached (number)' },
      { key: 'stat_people_label', label: 'People Label' },
      { key: 'stat_villages', label: 'Villages (number)' },
      { key: 'stat_villages_label', label: 'Villages Label' },
      { key: 'stat_programs', label: 'Programs (number)' },
      { key: 'stat_programs_label', label: 'Programs Label' },
      { key: 'stat_volunteers', label: 'Volunteers (number)' },
      { key: 'stat_volunteers_label', label: 'Volunteers Label' },
    ],
  },
  {
    title: 'Mission & Vision',
    fields: [
      { key: 'mission', label: 'Mission Statement', textarea: true },
      { key: 'vision', label: 'Vision Statement', textarea: true },
    ],
  },
  {
    title: 'Call To Action',
    fields: [
      { key: 'cta_title', label: 'CTA Title' },
      { key: 'cta_subtitle', label: 'CTA Subtitle', textarea: true },
    ],
  },
  {
    title: 'Contact & Social',
    fields: [
      { key: 'contact_address', label: 'Address', textarea: true },
      { key: 'contact_email', label: 'Email' },
      { key: 'contact_phone', label: 'Phone' },
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_twitter', label: 'Twitter URL' },
      { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_linkedin', label: 'LinkedIn URL' },
    ],
  },
];

const ManageContent = () => {
  const { content, refresh } = useContent();
  const { push } = useToast();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    setForm(content);
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/content', form);
      await refresh();
      push('Content saved successfully');
    } catch {
      push('Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageTitle title="Site Content" subtitle="Edit homepage text, statistics and contact details." />
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Group nav */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-2">
            {groups.map((g, i) => (
              <button
                key={g.title}
                onClick={() => setActiveGroup(i)}
                className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                  activeGroup === i ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-extrabold text-ink-900">{groups[activeGroup].title}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {groups[activeGroup].fields.map((f) => (
                <div key={f.key} className={f.textarea ? 'sm:col-span-2' : ''}>
                  <label className="label">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      rows={3}
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="input resize-none"
                    />
                  ) : (
                    <input
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="input"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
