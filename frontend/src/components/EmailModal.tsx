'use client';
import { useState } from 'react';
import type { Alloy } from '@/lib/alloys';
import type { Press } from '@/lib/presses';

interface Props {
  alloy: Alloy;
  press: Press;
  jobId: string | null;
  onClose: () => void;
}

export function EmailModal({ alloy, press, jobId, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!email) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {sent ? (
          <>
            <div className="modal-sent-icon">✓</div>
            <p className="modal-sent-text">Package sent to MTC</p>
            <p className="modal-sent-sub">
              {alloy.name} · {press.name} — {email}
            </p>
            {jobId && (
              <p className="modal-sent-sub" style={{ marginTop: 6, opacity: 0.6, fontSize: 10 }}>
                Job {jobId.slice(0, 8)}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="modal-title">Send to MTC for Approval</h2>
            <p className="modal-sub">
              {alloy.name} · {press.name} · HIP {alloy.hipTemp} {alloy.hipPressure} {alloy.hipHold}
            </p>
            <label className="modal-label" htmlFor="mtc-email">Recipient e-mail</label>
            <input
              id="mtc-email"
              type="email"
              className="modal-input"
              placeholder="engineer@mtcpowder.se"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <div className="modal-actions">
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleSend}
                disabled={!email || sending}
              >
                {sending ? 'Sending…' : 'Send Package'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
