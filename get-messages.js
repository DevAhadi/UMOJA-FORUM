// netlify/functions/get-messages.js
import { blobs } from '@netlify/blobs';

export default async () => {
  const keys = await blobs.list();
  const messages = [];

  for (const key of keys) {
    const blob = await blobs.get(key);
    messages.push(JSON.parse(blob));
  }

  // Sort by newest first
  messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return new Response(JSON.stringify(messages), {
    headers: { 'Content-Type': 'application/json' }
  });
};