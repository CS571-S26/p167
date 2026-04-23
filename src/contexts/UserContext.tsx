import { createContext, useEffect, useState } from "react";
import { type ReactNode } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { type Article } from "../types";

interface UserContextType {
  user: User | null;
  savedArticles: Article[];
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  unsaveArticle: (article: Article) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to fetch articles from local Supabase instance
  const loadArticles = async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_articles')
      .select('articles')
      .eq('user_id', userId)
      .single();

    if (!error && data?.articles) {
      setSavedArticles(data.articles as Article[]);
    } else {
      setSavedArticles([]);
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadArticles(currentUser.id);
      setLoading(false);
    });

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (event === 'SIGNED_IN' && currentUser) {
        loadArticles(currentUser.id);
      } else if (event === 'SIGNED_OUT') {
        setSavedArticles([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const register = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addArticle = async (newArticle: Article) => {
    if (!user) throw new Error("Must be logged in to save articles");

    if (savedArticles.find(a => a.article_id === newArticle.article_id)) return;

    const updatedList = [...savedArticles, newArticle];
    
    setSavedArticles(updatedList);

    const { error } = await supabase
      .from('saved_articles')
      .upsert({ 
        user_id: user.id, 
        articles: updatedList,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      // Rollback state if the database save fails
      setSavedArticles(savedArticles);
      throw error;
    }
  };

  const unsaveArticle = async (article: Article) => {
    if (!user) throw new Error("Must be logged in to manage articles");

    // Create the new list by filtering out the target ID
    const updatedList = savedArticles.filter(a => a.article_id !== article.article_id);
    
    // Optimistically update the local state
    // We keep a copy of the old list in case we need to rollback
    const previousArticles = [...savedArticles];
    setSavedArticles(updatedList);

    try {
      const { error } = await supabase
        .from('saved_articles')
        .upsert({ 
          user_id: user.id, 
          articles: updatedList,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (error) {
      // Rollback state if the database call fails
      setSavedArticles(previousArticles);
      console.error("Failed to unsave article:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, savedArticles, loading, login, register, logout, addArticle, unsaveArticle }}>
      {!loading && children}
    </UserContext.Provider>
  );
};