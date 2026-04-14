import React, { useEffect, useState } from 'react';
import { getEvents, getPage } from '../api';
import { PageHero, EventCard, LoadingSpinner } from '../components/common';

const FILTERS = ['All', 'Marathon', 'Fitness', 'Awareness'];
const defaultPageData = {
  page: 'events',
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

export default function EventsPage() {
  const [pageData, setPageData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    Promise.allSettled([getPage('events'), getEvents()])
      .then(([pageRes, eventsRes]) => {
        setPageData(pageRes.status === 'fulfilled' ? pageRes.value.data.data : defaultPageData);
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => {
    const normalizedCategory = e.category === 'Inclusive Fitness' ? 'Fitness' : e.category;
    const catMatch = filter === 'All' || normalizedCategory === filter;
    const statusMatch = statusFilter === 'all' || e.status === statusFilter;
    return catMatch && statusMatch;
  });

  return (
    <div>
      <PageHero content={pageData?.sections?.find(s => s.type === 'page_hero')?.content || { heading: 'Our Events', subtext: 'Join us at our marathons, fitness events, and community activities.' }} />

      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f ? 'bg-primary text-white shadow-soft' : 'bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all', 'upcoming', 'past'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    statusFilter === s ? 'bg-accent text-primary-dark' : 'bg-gray-100 text-gray-600 hover:bg-accent/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg">No events found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(event => <EventCard key={event._id} event={event} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
