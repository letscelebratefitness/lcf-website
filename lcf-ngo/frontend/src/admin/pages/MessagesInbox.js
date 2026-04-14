import React, { useEffect, useState } from 'react';
import { getContacts, markContactRead, deleteContact } from '../../api';
import { toast } from 'react-toastify';
import { AdminPageHeader, EmptyState } from '../components/FormComponents';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getContacts().then(r => setMessages(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await markContactRead(msg._id);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
      } catch { /* silent */ }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteContact(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <AdminPageHeader
        title="Messages Inbox"
        subtitle={`${unread} unread message${unread !== 1 ? 's' : ''} of ${messages.length} total`}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon="📭" title="No Messages Yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="grid md:grid-cols-5 gap-4 h-[calc(100vh-180px)] min-h-[400px]">
          {/* Message List */}
          <div className="md:col-span-2 overflow-y-auto space-y-2 pr-1">
            {messages.map(msg => (
              <button
                key={msg._id}
                onClick={() => handleOpen(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?._id === msg._id
                    ? 'bg-primary text-white border-primary'
                    : msg.read
                      ? 'bg-white border-gray-100 hover:border-primary-light'
                      : 'bg-primary-light border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${selected?._id === msg._id ? 'text-white' : 'text-gray-800'}`}>
                      {msg.name}
                      {!msg.read && selected?._id !== msg._id && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                      )}
                    </div>
                    <div className={`text-xs truncate mt-0.5 ${selected?._id === msg._id ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.subject || msg.message?.slice(0, 40) || '(no subject)'}
                    </div>
                  </div>
                  <div className={`text-xs whitespace-nowrap ${selected?._id === msg._id ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
            {selected ? (
              <>
                <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-primary-dark">{selected.name}</h3>
                    <div className="text-sm text-gray-400 mt-0.5 space-x-3">
                      <span>✉️ {selected.email}</span>
                      {selected.phone && <span>📞 {selected.phone}</span>}
                    </div>
                    {selected.subject && (
                      <div className="text-sm font-medium text-gray-600 mt-1">Re: {selected.subject}</div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to LCF'}`}
                      className="btn-outline text-xs py-1.5 px-3">Reply ✉️</a>
                    <button onClick={() => handleDelete(selected._id)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 overflow-y-auto">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  <p className="text-xs text-gray-300 mt-6">
                    Received: {new Date(selected.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-300">
                <div className="text-center">
                  <div className="text-5xl mb-3">✉️</div>
                  <p className="text-sm">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
