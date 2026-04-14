import React, { useEffect, useState } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import { Field, TextArea, VisibilityToggle, ImageUploader, AdminPageHeader, EmptyState, AdminSectionCard, SaveButton } from '../components/FormComponents';

const EVENT_CATEGORIES = ['Marathon', 'Fitness', 'Awareness'];
const DEFAULT_EVENTS_PAGE = {
  page: 'events',
  title: "Events | Let's Celebrate Fitness",
  sections: [
    {
      type: 'page_hero',
      visible: true,
      order: 1,
      content: {
        heading: 'Our Events',
        subtext: 'Join us at our marathons, fitness events, and community activities.',
        image: ''
      }
    }
  ]
};

const EMPTY_EVENT = {
  title: '', description: '', date: '', location: '',
  participants: '', status: 'past', category: 'Marathon', visible: true, image: '', link: ''
};

function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_EVENT,
    ...(event || {}),
    category: event?.category === 'Inclusive Fitness' ? 'Fitness' : (event?.category || EMPTY_EVENT.category)
  }));
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      if (name === 'status' && value === 'upcoming') next.participants = '';
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.title) return toast.error('Title is required');
    if (!form.category) return toast.error('Category is required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        participants: form.status === 'past' && form.participants !== '' ? Number(form.participants) : undefined
      };

      if (form._id) {
        const r = await updateEvent(form._id, payload);
        onSave(r.data.data, 'update');
        toast.success('Event updated!');
      } else {
        const r = await createEvent(payload);
        onSave(r.data.data, 'create');
        toast.success('Event created!');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold text-primary-dark">
            {form._id ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">x</button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Event Title" name="title" value={form.title} onChange={change} required />
          <TextArea label="Description" name="description" value={form.description} onChange={change} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" name="date" type="date" value={form.date ? form.date.split('T')[0] : ''} onChange={change} />
            <Field label="Location" name="location" value={form.location} onChange={change} />
          </div>
          <Field label="Registration Link" name="link" value={form.link} onChange={change} placeholder="https://example.com/register" />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Number of Participants"
              name="participants"
              type="number"
              value={form.participants}
              onChange={change}
              disabled={form.status !== 'past'}
              placeholder={form.status === 'past' ? 'Enter participant count' : 'Past events only'}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={change}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {EVENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={change}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <VisibilityToggle visible={form.visible} onChange={v => setForm(f => ({ ...f, visible: v }))} label="Event" />
            </div>
          </div>
          <ImageUploader label="Event Image" currentUrl={form.image}
            onUpload={url => setForm(f => ({ ...f, image: url }))}
            onUrlChange={url => setForm(f => ({ ...f, image: url }))} />
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="btn-outline text-sm py-2 px-5">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsManager() {
  const [pageData, setPageData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    Promise.allSettled([getPage('events'), getAllEvents()])
      .then(([pageRes, eventsRes]) => {
        setPageData(pageRes.status === 'fulfilled' ? pageRes.value.data.data : DEFAULT_EVENTS_PAGE);
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hero = pageData?.sections?.find(s => s.type === 'page_hero')?.content || {};

  const updateHero = (field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.type === 'page_hero' ? { ...s, content: { ...s.content, [field]: value } } : s)
    }));
  };

  const saveHero = async () => {
    setSavingHero(true);
    try {
      await updatePage('events', pageData);
      toast.success('Events page hero saved!');
    } catch {
      toast.error('Failed to save hero.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSave = (event, action) => {
    if (action === 'create') setEvents(e => [event, ...e]);
    else setEvents(e => e.map(ev => ev._id === event._id ? event : ev));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event permanently?')) return;
    setDeleting(id);
    try {
      await deleteEvent(id);
      setEvents(e => e.filter(ev => ev._id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const toggleVisible = async (event) => {
    try {
      const r = await updateEvent(event._id, { ...event, visible: !event.visible });
      setEvents(e => e.map(ev => ev._id === event._id ? r.data.data : ev));
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Events Manager" subtitle={`${events.length} total events`}>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          + New Event
        </button>
      </AdminPageHeader>

      {pageData && (
        <AdminSectionCard title="Events Page Hero" icon="P">
          <div className="space-y-4">
            <Field label="Heading" value={hero.heading} onChange={e => updateHero('heading', e.target.value)} />
            <Field label="Subtext" value={hero.subtext} onChange={e => updateHero('subtext', e.target.value)} />
            <ImageUploader label="Hero Image" currentUrl={hero.image}
              onUpload={url => updateHero('image', url)}
              onUrlChange={url => updateHero('image', url)} />
            <div className="flex justify-end">
              <SaveButton saving={savingHero} onClick={saveHero} label="Save Hero" />
            </div>
          </div>
        </AdminSectionCard>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon="E" title="No Events Yet" description="Create your first event to get started."
          action={<button onClick={() => setModal('create')} className="btn-primary">Create Event</button>} />
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-5 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : <span className="text-2xl">E</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <h3 className="font-semibold text-gray-800 flex-1">{event.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                  {event.category && <span className="tag text-xs">{event.category}</span>}
                  {event.date && <span>{new Date(event.date).toLocaleDateString('en-IN')}</span>}
                  {event.participants && <span>{Number(event.participants).toLocaleString()}+</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <VisibilityToggle visible={event.visible} onChange={() => toggleVisible(event)} label="" />
                <button onClick={() => setModal(event)} className="w-8 h-8 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center text-sm">Edit</button>
                <button onClick={() => handleDelete(event._id)} disabled={deleting === event._id}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-xs disabled:opacity-50">
                  {deleting === event._id ? '...' : 'Del'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <EventModal
          event={modal === 'create' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
