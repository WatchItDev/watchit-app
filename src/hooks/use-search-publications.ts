import { useState, useEffect } from 'react';
import { supabase } from '@src/utils/supabase';
import {SupabasePublication} from "@src/hooks/types.ts"

export const useSearchPublications = (query: string) => {
  const [publications, setPublications] = useState<SupabasePublication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('publications')
        .select('post_id, title, description')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      if (error) {
        setError(error.message);
      } else {
        setPublications(data);
      }

      setLoading(false);
    };

    if (query) {
      fetchPublications();
    } else {
      setPublications([]);
    }
  }, [query]);

  return { publications, loading, error };
};
