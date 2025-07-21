// Hash utility using SubtleCrypto for timeline data
export async function calculateTimelineHash(items) {
  if (!Array.isArray(items) || items.length === 0) return '';
  const filtered = items.map(item => ({
    title: item.title,
    cardTitle: item.cardTitle,
    cardSubtitle: item.cardSubtitle,
    cardDetailedText: item.cardDetailedText,
    url: item.url,
    media: item.media,
  }));
  const json = JSON.stringify(filtered);
  const encoder = new TextEncoder();
  const data = encoder.encode(json);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
