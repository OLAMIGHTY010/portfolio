ALTER TABLE public.site_settings RENAME COLUMN is_open_to_work TO is_open_to_opportunities; NOTIFY pgrst, 'reload schema';
