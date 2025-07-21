import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      setTimelineData(data);
      navigate('/timeline');
    } catch (err) {
      alert('Unable to fetch or parse JSON from URL.');
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
        setTimelineData(data);
        navigate('/timeline');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h2>Timeline App</h2>
      <input type="file" accept="application/json" onChange={handleFileChange} style={{ marginBottom: 8 }} />
      <div style={{ margin: '8px 0', fontWeight: 'bold', color: '#888' }}>Or</div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
        <input
          type="url"
          placeholder="Enter JSON file URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={handleUrlLoad} disabled={loading} style={{ width: '100%' }}>
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
    </div>
  );
}
