
import React from 'react';
import socialLogo from '../assets/react-chrono-logo-small.png';
import { useNavigate } from 'react-router-dom';

// Validate a single timeline item according to react-chrono TimelineItemModel
function isValidTimelineItem(item) {
  if (!item || typeof item !== 'object') return false;
  // title: string or ReactNode (accept string)
  // if (!('title' in item) && !('date' in item)) return false;
  if ('title' in item && typeof item.title !== 'string') return false;
  // cardTitle: string or ReactNode (accept string)
  if ('cardTitle' in item && typeof item.cardTitle !== 'string') return false;
  // cardSubtitle: string or ReactNode (accept string)
  if ('cardSubtitle' in item && typeof item.cardSubtitle !== 'string') return false;
  // cardDetailedText: string, string[], ReactNode, ReactNode[] (accept string or array of strings)
  if ('cardDetailedText' in item) {
    const t = item.cardDetailedText;
    if (!(typeof t === 'string' || (Array.isArray(t) && t.every(s => typeof s === 'string')))) return false;
  }
  // media: object with required fields if present
  if ('media' in item) {
    const m = item.media;
    if (!m || typeof m !== 'object') return false;
    if (!('type' in m) || (m.type !== 'IMAGE' && m.type !== 'VIDEO')) return false;
    if (!('source' in m) || typeof m.source !== 'object' || typeof m.source.url !== 'string') return false;
    if ('name' in m && typeof m.name !== 'string') return false;
    if ('active' in m && typeof m.active !== 'boolean') return false;
    if ('id' in m && typeof m.id !== 'string') return false;
  }
  // url: string
  if ('url' in item && typeof item.url !== 'string') return false;
  // date: string, number, or Date (accept string or number)
  if ('date' in item && !(typeof item.date === 'string' || typeof item.date === 'number')) return false;
  // items: nested timeline items
  if ('items' in item) {
    if (!Array.isArray(item.items) || !item.items.every(isValidTimelineItem)) return false;
  }
  // hasNestedItems: boolean
  if ('hasNestedItems' in item && typeof item.hasNestedItems !== 'boolean') return false;
  // active: boolean
  if ('active' in item && typeof item.active !== 'boolean') return false;
  // id: string
  if ('id' in item && typeof item.id !== 'string') return false;
  // visible: boolean
  if ('visible' in item && typeof item.visible !== 'boolean') return false;
  return true;
}

function isValidTimelineData(data) {
  // Must be an object with an 'items' key that is an array of valid items
  if (!data || typeof data !== 'object' || !Array.isArray(data.items)) return false;
  return data.items.every(isValidTimelineItem);
}

export default function Entry({ setTimelineData }) {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleUrlLoad = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (!isValidTimelineData(data)) {
        throw new Error('Invalid timeline data structure.');
      }
      setTimelineData(data);
      navigate('/timeline');
    } catch (err) {
      alert('Unable to fetch or parse valid timeline JSON from URL.');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!isValidTimelineData(data)) {
          throw new Error('Invalid timeline data structure.');
        }
        setTimelineData(data);
        navigate('/timeline');
      } catch (err) {
        alert('Invalid timeline JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <h1 style={{ fontSize: '2.2em', marginBottom: 8 }}>Chrono Timeline</h1>
        <div style={{ fontSize: '1em', color: '#888', marginBottom: 12 }}>A simple timeline app built with</div>
        <a href="https://github.com/prabhuignoto/react-chrono" target="_blank" rel="noopener noreferrer">
          <img src={socialLogo} alt="React Chrono" style={{ maxWidth: "100%", marginBottom: 8 }} />
        </a>
      </div>
      <input type="file" accept="application/json" onChange={handleFileChange} style={{ marginBottom: 8 }} />
      <div style={{ margin: '8px 0', fontWeight: 'bold', color: '#888' }}>Or</div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0' }}>
        <input
          type="url"
          placeholder="Enter JSON file URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={handleUrlLoad} disabled={loading}>
          {loading ? 'Loading...' : 'Load from URL'}
        </button>
      </div>
      <div style={{ margin: '8px 0', fontWeight: 'bold', color: '#888' }}>Or</div>
      <div style={{ margin: '8px 0' }}>
        <button onClick={() => {
          setTimelineData({ items: [] });
          navigate('/edit');
        }}>Create New Timeline</button>
      </div>
      <div style={{ marginTop: 40, fontSize: '1em', color: '#b71c1c', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: 16, maxWidth: 500 }}>
        <b>Be aware of misinformation:</b>
        <div style={{ marginTop: 8, marginBottom: 0, color: '#b71c1c' }}>
          As people sharing stories and events, always make sure that
        </div>
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
          <li>There are trust-worthy sources that backs up the information (Valid URL from official or news sites)</li>
          <li>Double check with more sources (Searching online, check in person if possible)</li>
        </ul>
      </div>
    </div>
  );
}
