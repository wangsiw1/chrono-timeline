import React from 'react';
import { Chrono } from 'react-chrono';
import { useNavigate } from 'react-router-dom';
import { calculateTimelineHash } from '../utils/hash';

export default function Timeline({ timelineData }) {
  const navigate = useNavigate();
  const [hash, setHash] = React.useState('');

  React.useEffect(() => {
    if (timelineData?.items && Array.isArray(timelineData.items)) {
      calculateTimelineHash(timelineData.items).then(setHash);
    } else {
      setHash('');
    }
  }, [timelineData]);

  if (!timelineData || !timelineData.items) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p>No timeline data loaded.</p>
        <button onClick={() => navigate('/')}>Back to Entry</button>
      </div>
    );
  }
  // Use items as-is, no date sorting
  const chronoItems = [...timelineData.items]
    .filter(item => item && typeof item === 'object')
    .map(item => {
      // Remove unsupported props for Chrono, only pass allowed fields
      const { title, cardTitle, cardSubtitle, cardDetailedText, url, media } = item;
      const chronoItem = { title, cardTitle, cardSubtitle, cardDetailedText, url, media };
      return chronoItem;
    });
  return (
    <div
      style={{
        margin: 'auto',
        padding: 16,
        paddingBottom: 32,
        minHeight: '80vh',
        textAlign: 'center',
        width: '90%',
        maxWidth: 1000,
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <style>{`
        .timeline-item-title {
          white-space: pre-wrap;
          word-break: break-all;
        }
        .timeline-main-wrapper {
          padding: 0 !important;
          max-height: calc(100vh - 180px);
          overflow-y: auto !important;
        }
      `}</style>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <Chrono items={chronoItems} mode="VERTICAL" />
      </div>
      <div style={{ marginTop: 16, fontSize: '0.9em', color: '#888' }}>
        <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <b>Data Hash:</b> {hash}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        {!timelineData?._loadedFromUrl && (
          <button onClick={() => navigate('/edit')}>Edit Timeline</button>
        )}
        <button
          style={{ marginLeft: 8 }}
          onClick={e => {
            e.preventDefault();
            if (!timelineData?._loadedFromUrl && timelineData?.items && timelineData.items.length > 0) {
              if (window.confirm('Leaving will discard your current timeline. Continue? (You can save the data in the Edit page)')) {
                navigate('/');
              }
            } else {
              navigate('/');
            }
          }}
        >
          Back to Entry
        </button>
      </div>
    </div>
  );
}
