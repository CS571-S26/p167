import { useState } from 'react';
import { supabase } from '../supabaseClient';

export const useTranslate = () => {
  const [loading, setLoading] = useState(false);

  const translateBatch = async (texts: string[], targetLanguage: string): Promise<string[] | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text: texts, targetLanguage },
      });

      if (error) throw error;
      
      return data.translations;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { translateBatch, loading };
};