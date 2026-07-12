import pdfParse from 'pdf-parse';

function bufferToText(buffer) {
  return buffer.toString('utf8').replace(/\u0000/g, '').trim();
}

export async function extractTextFromResumeFile(file) {
  if (!file?.buffer?.length) {
    return '';
  }

  const mimeType = file.mimetype || '';

  if (mimeType.includes('pdf')) {
    const parsed = await pdfParse(file.buffer);
    return (parsed.text || '').trim();
  }

  return bufferToText(file.buffer);
}