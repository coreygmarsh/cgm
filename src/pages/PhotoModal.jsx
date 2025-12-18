import React, { useEffect } from "react";

const PhotoModal = ({ photo, onClose }) => {
  useEffect(() => {
    if (!photo) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onMouseDown={onClose} // click outside closes
    >
      <div
        className="relative w-full max-w-6xl rounded-2xl border border-emerald-400/25 bg-black/60 backdrop-blur-xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()} // prevent close when clicking inside
        style={{
          boxShadow:
            "0 0 40px rgba(0,255,150,0.18), inset 0 0 60px rgba(0,255,150,0.08)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-400/15">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-200/70 font-heading">
              Imagery
            </div>
            <div className="text-lg md:text-xl font-bold text-emerald-100 font-heading">
              {photo.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-full text-emerald-100/80 hover:text-emerald-100 border border-emerald-400/20 hover:border-emerald-400/50 bg-black/30 transition"
            aria-label="Close photo modal"
          >
            ✕
          </button>
        </div>

        {/* image: preserves original aspect ratio */}
        <div className="p-4 md:p-6">
          <div className="w-full max-h-[75vh] flex items-center justify-center">
            <img
              src={photo.image}
              alt={photo.title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              draggable={false}
              style={{
                boxShadow: "0 0 30px rgba(0,255,150,0.20)",
              }}
            />
          </div>

          {photo.description && (
            <p className="mt-4 text-emerald-100/70 font-body">
              {photo.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
