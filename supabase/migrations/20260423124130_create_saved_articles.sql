drop policy "Users can manage their own saved articles" on "public"."saved_articles";

alter table "public"."saved_articles" drop column "collection_name";

CREATE UNIQUE INDEX saved_articles_user_id_key ON public.saved_articles USING btree (user_id);

alter table "public"."saved_articles" add constraint "saved_articles_user_id_key" UNIQUE using index "saved_articles_user_id_key";


  create policy "Users can manage their own saved articles"
  on "public"."saved_articles"
  as permissive
  for all
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));




