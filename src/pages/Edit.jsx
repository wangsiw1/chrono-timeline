import React, { useState } from 'react';
import cardFieldImg from '../assets/card_field.png';
import styles from './Edit.module.css';
import { useNavigate } from 'react-router-dom';
import { calculateTimelineHash } from '../utils/hash';

export default function Edit({ timelineData, setTimelineData }) {
  const [items, setItems] = useState(timelineData?.items || []);
  const [title, setTitle] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubtitle, setCardSubtitle] = useState('');
  const [cardDetailedText, setCardDetailedText] = useState('');
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState('IMAGE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [hash, setHash] = useState('');
  const [editIdx, setEditIdx] = useState(null); // index of item being edited
  const [selected, setSelected] = useState([]); // selected item indices
  const navigate = useNavigate();

  React.useEffect(() => {
    calculateTimelineHash(items).then(setHash);
  }, [items]);

  const addItem = () => {
    const media = mediaUrl
      ? {
          type: mediaType,
          source: { url: mediaUrl },
          name: mediaName,
        }
      : undefined;
    setItems([
      ...items,
      { title, cardTitle, cardSubtitle, cardDetailedText, url, media },
    ]);
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setCardTitle('');
    setCardSubtitle('');
    setCardDetailedText('');
    setUrl('');
    setMediaType('IMAGE');
    setMediaUrl('');
    setMediaName('');
    setEditIdx(null);
  };

  const moveItemUp = (idx) => {
    if (idx === 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setItems(newItems);
  };

  const moveItemDown = (idx) => {
    if (idx === items.length - 1) return;
    const newItems = [...items];
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    setItems(newItems);
  };

  const startEditItem = (idx) => {
    const item = items[idx];
    setTitle(item.title || '');
    setCardTitle(item.cardTitle || '');
    setCardSubtitle(item.cardSubtitle || '');
    setCardDetailedText(item.cardDetailedText || '');
    setUrl(item.url || '');
    setMediaType(item.media?.type || 'IMAGE');
    setMediaUrl(item.media?.source?.url || '');
    setMediaName(item.media?.name || '');
    setEditIdx(idx);
  };

  const saveEditItem = () => {
    const media = mediaUrl
      ? {
          type: mediaType,
          source: { url: mediaUrl },
          name: mediaName,
        }
      : undefined;
    const newItem = { title, cardTitle, cardSubtitle, cardDetailedText, url, media };
    setItems(items.map((item, idx) => (idx === editIdx ? newItem : item)));
    clearForm();
  };

  const discardEditItem = () => {
    clearForm();
  };

  const saveTimeline = () => {
    setTimelineData({ items });
    navigate('/timeline');
  };

  const exportJson = async () => {
    const exportData = { items };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'timeline.json');
    dlAnchor.click();
  };

  const removeItem = (idx) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setItems(items.filter((_, i) => i !== idx));
      setSelected(selected.filter(i => i !== idx));
    }
  };

  const toggleSelect = (idx) => {
    setSelected(selected.includes(idx)
      ? selected.filter(i => i !== idx)
      : [...selected, idx]);
  };

  const removeSelectedItems = () => {
    if (selected.length === 0) return;
    if (window.confirm('Are you sure you want to remove the selected items?')) {
      setItems(items.filter((_, i) => !selected.includes(i)));
      setSelected([]);
    }
  };

  return (
    <div className={styles['edit-timeline-container']}>
      <h2 style={{ textAlign: 'center' }}>Edit Timeline</h2>
      <div className={styles['edit-timeline-content']}>
        <form
          className={styles['edit-timeline-form']}
          onSubmit={e => {
            e.preventDefault();
            if (editIdx !== null) {
              saveEditItem();
            } else {
              addItem();
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Title:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Card Title:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Card Title" value={cardTitle} onChange={e => setCardTitle(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Card Subtitle:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Card Subtitle" value={cardSubtitle} onChange={e => setCardSubtitle(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Card Detailed Text:</label>
            <textarea style={{ flex: 1, minWidth: 200, minHeight: 60 }} placeholder="Card Detailed Text" value={cardDetailedText} onChange={e => setCardDetailedText(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>URL:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Link to source" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Media URL:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Youtube video or image link" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Media Type:</label>
            <select style={{ minWidth: 100 }} value={mediaType} onChange={e => setMediaType(e.target.value)}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ width: 120 }}>Media Alt:</label>
            <input style={{ flex: 1, minWidth: 200 }} placeholder="Media Name or Alt Text" value={mediaName} onChange={e => setMediaName(e.target.value)} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            {editIdx !== null ? (
              <>
                <button type="submit">Save</button>
                <button type="button" style={{ marginLeft: 8 }} onClick={discardEditItem}>Discard</button>
              </>
            ) : (
              <button type="submit">Add Item</button>
            )}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{ margin: '16px 0', fontSize: '0.9em', color: '#888' }}>
              <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
                <b>Data Hash:</b> {hash}
              </div>
            </div>
            <button onClick={e => { e.preventDefault(); saveTimeline(); }}>Save & View Timeline</button>
            <button style={{ marginLeft: 8, marginTop: 8 }} onClick={ e => { e.preventDefault(); exportJson(); }}>Export as JSON</button>
            <button
              style={{ marginLeft: 8, marginTop: 8 }}
              onClick={e => {
                e.preventDefault();
                if (items.length > 0) {
                  if (window.confirm('You have unsaved changes. Leaving will discard your current timeline. Continue?')) {
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
        </form>
        {items.length > 0 ? (
          <div className={styles['edit-timeline-list']}>
            <div style={{ marginBottom: 12 }}>
              <button
                style={{ fontSize: '0.9em', padding: '4px 12px' }}
                onClick={removeSelectedItems}
                disabled={editIdx !== null || selected.length === 0}
              >Remove Selected</button>
            </div>
            <ul style={{ width: '100%', paddingLeft: 8 }}>
              {items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(idx)}
                    onChange={() => toggleSelect(idx)}
                    disabled={editIdx !== null}
                    style={{ marginRight: 12, marginTop: 4 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>
                      <b>{item.title}</b> - {item.cardTitle}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button
                        style={{ fontSize: '0.8em', padding: '2px 8px' }}
                        onClick={() => moveItemUp(idx)}
                        disabled={editIdx !== null || idx === 0}
                      >↑</button>
                      <button
                        style={{ fontSize: '0.8em', padding: '2px 8px' }}
                        onClick={() => moveItemDown(idx)}
                        disabled={editIdx !== null || idx === items.length - 1}
                      >↓</button>
                      <button
                        style={{ fontSize: '0.8em', padding: '2px 8px' }}
                        onClick={() => startEditItem(idx)}
                        disabled={editIdx !== null}
                      >Edit</button>
                      <button
                        style={{ fontSize: '0.8em', padding: '2px 8px' }}
                        onClick={() => removeItem(idx)}
                        disabled={editIdx !== null}
                      >Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#888' }}>No timeline items yet. Add your first item!</div>
            <div style={{ color: '#888', marginBottom: 16 }}>Example image below for field reference</div>
            <img src={cardFieldImg} alt="No items" style={{ maxWidth: '100%', height: 'auto', outline: '#007fff solid 5px' }} />
          </div>
        )}
      </div>
    </div>
  );
};
