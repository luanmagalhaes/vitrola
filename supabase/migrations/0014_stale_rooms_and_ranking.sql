alter table vt_matches
  add column if not exists closed_by text not null default 'target';

create index if not exists vt_rooms_started_idx on vt_rooms(phase, started_at);
