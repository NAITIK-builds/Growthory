-- Function to match startups using cosine similarity
create or replace function match_startups (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  industry text,
  stage text,
  one_line_pitch text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    startups.id,
    startups.name,
    startups.industry,
    startups.stage,
    startup_analysis.one_line_pitch,
    1 - (startups.embedding <=> query_embedding) as similarity
  from startups
  join startup_analysis on startups.id = startup_analysis.startup_id
  where 1 - (startups.embedding <=> query_embedding) > match_threshold
  order by startups.embedding <=> query_embedding
  limit match_count;
end;
$$;
