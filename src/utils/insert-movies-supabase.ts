import {supabase} from "@src/utils/supabase.ts";

const InsertMoviesSupabase: ({publications}: { publications: any }) => Promise<void> = async ({ publications}) => {

      if (publications) {
      for (const publication of publications) {
        if(!publication.isHidden) {
          const { title, content: description} = publication.metadata;
          const post_id = publication.id;

          // Check if the publication already exists
          const { data: existingPublications, error: selectError } = await supabase
            .from('publications')
            .select('id')
            .eq('post_id', post_id);

          if (selectError) {
            console.error('Error checking existing publication:', selectError);
            continue;
          }

          // If the publication does not exist, insert it
          if (existingPublications.length === 0) {
            const { error: insertError } = await supabase
              .from('publications')
              .insert([{ title, description, post_id}]);

            if (insertError) {
              console.error('Error inserting publication:', insertError);
            }
          }
        }
      }
    }
}

export default InsertMoviesSupabase;
