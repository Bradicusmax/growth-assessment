'use client';

import { useEffect, useCallback } from 'react';
import Script from 'next/script';

const BASE_FORM_URL = 'https://api.leadconnectorhq.com/widget/form/TSvXW6B7BhstpdVfk35P';

export default function FormModal({ isOpen, onClose, reportUrl }) {
  const formSrc = reportUrl
    ? `${BASE_FORM_URL}?report_url=${encodeURIComponent(reportUrl)}`
    : BASE_FORM_URL;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="form-modal-overlay active"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="form-modal">
          <button className="form-modal-close" onClick={onClose} aria-label="Close">&times;</button>
          <iframe
            src={formSrc}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '3px' }}
            id="inline-TSvXW6B7BhstpdVfk35P"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Assessment Rev Leaks"
            data-height="880"
            data-layout-iframe-id="inline-TSvXW6B7BhstpdVfk35P"
            data-form-id="TSvXW6B7BhstpdVfk35P"
            title="Assessment Rev Leaks"
          />
        </div>
      </div>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </>
  );
}
