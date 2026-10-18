-- Windows browsers commonly report .zip files as application/x-zip-compressed.
-- Keep that equivalent MIME type alongside application/zip for CTF attachments.
update storage.buckets
set allowed_mime_types = array_append(
  allowed_mime_types,
  'application/x-zip-compressed'
)
where id = 'ctf-files'
  and not (
    'application/x-zip-compressed' = any(allowed_mime_types)
  );
