// netlify/functions/send-message.js
import { blobs } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.json();
  const { text, image } = body;

  if (!text && !image) {
    return new Response('Message must have text or image', { status: 400 });
  }

  const blobId = `msg-${Date.now()}`;
  await blobs.set(blobId, JSON.stringify({
    id: blobId,
    text,
    image,
    timestamp: new Date().toISOString(),
    likes: 0,
  }));

  return new Response(JSON.stringify({ success: true, id: blobId }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
