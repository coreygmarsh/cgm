import React from 'react';

const BookModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-emerald-900/95 to-teal-950/95 rounded-2xl border border-emerald-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/40 rounded-full transition-all duration-300 text-emerald-300 hover:text-emerald-100"
          style={{ textShadow: '0 0 10px rgba(0, 255, 150, 0.5)' }}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh] p-8 md:p-12">
          <div className="mb-6">
            <span className="px-3 py-1 text-xs font-semibold text-emerald-900 bg-emerald-400 rounded-full">
              Published {book.year}
            </span>
          </div>

          <h2 
            className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
            style={{ textShadow: '0 0 30px rgba(0, 255, 150, 0.6)' }}
          >
            {book.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-gradient-to-br from-emerald-800/60 to-teal-900/60 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-emerald-200 mb-4">About This Book</h3>
              <p className="text-emerald-200/80 text-lg mb-6 leading-relaxed">
                {book.description}
              </p>
              
              {book.synopsis && (
                <>
                  <h3 className="text-2xl font-bold text-emerald-200 mb-4">Synopsis</h3>
                  <p className="text-emerald-100/90 leading-relaxed">
                    {book.synopsis}
                  </p>
                </>
              )}
            </div>
          </div>

          {book.chapters && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-emerald-200 mb-4">Table of Contents</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, idx) => (
                  <div key={idx} className="p-3 bg-emerald-900/20 rounded border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
                    <span className="text-emerald-400 font-semibold">Chapter {idx + 1}:</span>
                    <span className="text-emerald-100/90 ml-2">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;