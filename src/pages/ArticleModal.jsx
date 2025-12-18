import React from 'react';

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-emerald-900/95 to-black/50 rounded-2xl border border-emerald-500/30 overflow-hidden"
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
              {article.year}
            </span>
          </div>

          <h2 
            className="text-3xl md:text-4xl text-center font-body font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
            style={{ textShadow: '0 0 30px rgba(0, 255, 150, 0.6)' }}
          >
            {article.title}
          </h2>

          <p className="text-emerald-200/80 text-center font-body text-lg mb-8 italic">
            {article.description}
          </p>

          <div className="prose prose-invert prose-emerald max-w-none">
            <div className="text-emerald-100/90 leading-relaxed space-y-4">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;