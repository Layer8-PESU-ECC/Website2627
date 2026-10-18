-- Safe demo content. Replace descriptions and flags before publishing a real week.
insert into public.ctf_weeks
  (slug, sequence_no, title, summary, starts_at, ends_at, published)
values
  ('packet-zero', 1, 'Packet Zero',
   'Warm up the human layer with four beginner-friendly challenges.',
   now() - interval '1 day', now() + interval '6 days', true)
on conflict (slug) do nothing;

with active_week as (
  select id from public.ctf_weeks where slug = 'packet-zero'
)
insert into public.ctf_challenges
  (week_id, slug, title, category, difficulty, points, summary, description, published)
select id, 'robots-have-secrets', 'Robots Have Secrets', 'web', 'beginner', 100,
  'The crawler found something the navigation did not.',
  'Inspect the target carefully and recover the hidden flag.', true
from active_week
on conflict (week_id, slug) do nothing;

-- Demo flag: Layer8{replace_before_production}
insert into public.ctf_challenge_secrets (challenge_id, flag_hash)
select id, encode(digest('Layer8{replace_before_production}', 'sha256'), 'hex')
from public.ctf_challenges where slug = 'robots-have-secrets'
on conflict (challenge_id) do nothing;
