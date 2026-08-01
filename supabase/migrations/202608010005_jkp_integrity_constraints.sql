begin;

alter table public.jkp_rental_properties
  drop constraint if exists jkp_rentals_publication_state_check,
  add constraint jkp_rentals_publication_state_check
    check (not (published and hidden)),
  drop constraint if exists jkp_rentals_status_type_check,
  add constraint jkp_rentals_status_type_check
    check (status <> 'always_active' or type = 'holiday'),
  drop constraint if exists jkp_rentals_gallery_array_check,
  add constraint jkp_rentals_gallery_array_check
    check (jsonb_typeof(gallery) = 'array'),
  drop constraint if exists jkp_rentals_details_array_check,
  add constraint jkp_rentals_details_array_check
    check (jsonb_typeof(details) = 'array'),
  drop constraint if exists jkp_rentals_highlights_array_check,
  add constraint jkp_rentals_highlights_array_check
    check (jsonb_typeof(highlights) = 'array');

alter table public.jkp_references
  drop constraint if exists jkp_references_publication_state_check,
  add constraint jkp_references_publication_state_check
    check (not (published and hidden)),
  drop constraint if exists jkp_references_permission_check,
  add constraint jkp_references_permission_check
    check (not published or permission_confirmed),
  drop constraint if exists jkp_references_gallery_array_check,
  add constraint jkp_references_gallery_array_check
    check (jsonb_typeof(gallery) = 'array');

alter table public.jkp_form_submissions
  drop constraint if exists jkp_form_details_object_check,
  add constraint jkp_form_details_object_check
    check (jsonb_typeof(details) = 'object');

alter table public.jkp_site_content
  drop constraint if exists jkp_site_content_object_check,
  add constraint jkp_site_content_object_check
    check (jsonb_typeof(content) = 'object');

commit;
