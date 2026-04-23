import { Col, Button } from "react-bootstrap";
import type { Article } from "../types";
import TranslationContext from "../contexts/TranslationContext";
import { useContext, useState, useEffect } from "react";
import { useTranslate } from '../hooks/useTranslate';
import { useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { motion } from "framer-motion";

interface NewsCardProps {
  article: Article; 
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  console.log(article);
  const { user, addArticle, savedArticles, unsaveArticle } = useUser();
  const thisArticleIsSaved = savedArticles.some(a => a.article_id === article.article_id);
  
  const [searchParams] = useSearchParams();
  const lang: string = searchParams.get('lang') || '';
  const [displayData, setDisplayData] = useState({
    title: article.title,
    description: article.description ?? ""
  });
  const [cache, setCache] = useState<{title: string, description: string} | null>(null);

  const { translateBatch, loading } = useTranslate();
  const [translationToggle] = useContext(TranslationContext) || [true];
  const altImageURL = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"

  const handleSaveAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to save to your archive.");
    try {
      thisArticleIsSaved ? await unsaveArticle(article) : await addArticle(article);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };
  
  useEffect(() => {
    const autoTranslate = async () => {
      if(!translationToggle || lang === "en") { 
        setDisplayData({ title: article.title, description: article.description ?? "" });
        return; 
      }
      if (cache) { setDisplayData(cache); return; }
      const results = await translateBatch([article.title, article.description ?? ""], 'en');
      if (results) {
        const [translatedTitle, translatedDescription] = results;
        setDisplayData({ title: translatedTitle, description: translatedDescription });
        setCache({ title: translatedTitle, description: translatedDescription });
      }
    };
    autoTranslate();
  }, [article.article_id, translationToggle]);

  const formatMyDate = (dateString: string) => {
    // Replace the space with 'T' to ensure cross-browser ISO compatibility
    const date = new Date(dateString.replace(' ', 'T'));

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Col xs={12} md={6} lg={4} className="d-flex p-3">
      <motion.div 
        className="news-dossier-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.4 }}
      >
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="unstyled-link flex-grow-1">
          <div className="image-viewport">
            <img src={article.image_url || altImageURL} alt="News Source" className="dossier-img" />
          </div>

          <div className="dossier-body">
            <div className="source-indicator">
              <div className="pulse-dot-small" />
              <span>{article.source_name} - {formatMyDate(article.pubDate)}</span>
            </div>

            <h4 className="dossier-title">
              {loading ? "..." : displayData.title}
            </h4>
            
            <p className="dossier-snippet">
              {loading ? "Decrypting source text..." : displayData.description}
            </p>
          </div>
        </a>

        <div className="dossier-footer">
          <Button 
            className={`w-100 py-2 fw-bold action-btn ${thisArticleIsSaved ? 'btn-saved' : 'btn-unsaved'}`}
            onClick={handleSaveAction}
          >
            {thisArticleIsSaved ? "- Unsave Article" : "+ Save Article"}
          </Button>
        </div>
      </motion.div>
    </Col>
  );
}

export default NewsCard;