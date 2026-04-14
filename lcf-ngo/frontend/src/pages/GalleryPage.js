import React, { useEffect, useState } from 'react';
import { getGallery, getPage } from '../api';
import { PageHero, LoadingSpinner } from '../components/common';

const defaultPageData = {
  page: 'gallery',
  sections: [
    {
      type: 'page_hero',
      visible: true,
      order: 1,
      content: {
        heading: 'Gallery',
        subtext: 'Moments from our events, drives, and community activities.',
        image: ''
      }
    }
  ]
};

const PAGE_SIZE = 12;

export default function GalleryPage() {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    total: 0,
    categories: []
  });

  useEffect(() => {
    Promise.allSettled([getPage('gallery'), getGallery({ page: 1, limit: PAGE_SIZE })])
      .then(([pageRes, galleryRes]) => {
        setPageData(pageRes.status === 'fulfilled' ? pageRes.value.data.data : defaultPageData);
        if (galleryRes.status === 'fulfilled') {
          setImages(galleryRes.value.data.data);
          setPagination(galleryRes.value.data.meta || {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadGallery = (nextPage, category) => {
    setGalleryLoading(true);
    const params = { page: nextPage, limit: PAGE_SIZE };
    if (category && category !== 'all') params.category = category;

    getGallery(params)
      .then(response => {
        setImages(response.data.data);
        setPagination(response.data.meta || {});
        setActiveCategory(category || 'all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(console.error)
      .finally(() => setGalleryLoading(false));
  };

  const categories = ['all', ...(pagination.categories || [])];

  return (
    <div>
      <PageHero content={pageData?.sections?.find(s => s.type === 'page_hero')?.content || { heading: 'Gallery', subtext: 'Moments from our events, drives, and community activities.' }} />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => loadGallery(1, cat)}
                disabled={galleryLoading && activeCategory === cat}
                className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading || galleryLoading ? (
            <LoadingSpinner />
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">Gallery</div>
              <p>No gallery images yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {images.map((img, i) => (
                  <div
                    key={img._id || i}
                    className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group shadow-soft hover:shadow-hover transition-all duration-300"
                    onClick={() => setLightbox(img)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || img.title || 'LCF Gallery'}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {img.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">{img.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
                <p className="text-sm text-gray-500">
                  Page {pagination.page || 1} of {pagination.totalPages || 1}
                  {typeof pagination.total === 'number' ? ` • ${pagination.total} images` : ''}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => loadGallery((pagination.page || 1) - 1, activeCategory)}
                    disabled={!pagination.hasPrevPage}
                    className="btn-outline text-sm py-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => loadGallery((pagination.page || 1) + 1, activeCategory)}
                    disabled={!pagination.hasNextPage}
                    className="btn-primary text-sm py-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            x
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.alt || 'Gallery'}
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.title && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">{lightbox.title}</div>
          )}
        </div>
      )}
    </div>
  );
}
