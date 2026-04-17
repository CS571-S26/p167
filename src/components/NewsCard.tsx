import { Card, Col } from "react-bootstrap"
import type { Article } from "../types"
import ThemeContext from "../contexts/ThemeContext"
import TranslationContext from "../contexts/TranslationContext"
import { useContext, useState, useEffect } from "react"
import { useTranslate } from '../hooks/useTranslate';
import { useSearchParams } from "react-router-dom"

interface NewsCardProps {
  article: Article; 
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [searchParams] = useSearchParams();
  const lang: string = searchParams.get('lang') || '';
  const [displayData, setDisplayData] = useState({
    title: article.title,
    description: article.description ?? ""
  });
  const [cache, setCache] = useState<{title: string, description: string} | null>(null);

  const { translateBatch, loading } = useTranslate();
  const [theme] = useContext(ThemeContext) || ["dark"];
  const [translationToggle] = useContext(TranslationContext) || [true];
  const altImageURL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
  
  useEffect(() => {
    const autoTranslate = async () => {
      // If the user selected to show the original language, don't translate the text
      if(!translationToggle || lang === "en") { 
        setDisplayData({
          title: article.title,
          description: article.description ?? ""
        });
        return; 
      }

      // Check if the translation was already completed, and if so, display a cached version to reduce necessary API calls
      if (cache) {
        setDisplayData(cache);
        return;
      }
      
      const results = await translateBatch(
        [article.title, article.description ?? ""], 
        'en'
      );

      if (results) {
        const [translatedTitle, translatedDescription] = results;
        setDisplayData({
          title: translatedTitle,
          description: translatedDescription
        });
        setCache({
          title: translatedTitle,
          description: translatedDescription
        });
      }
    };

    autoTranslate();
  }, [article.article_id, translationToggle]);

  return (
    <Col 
      key={article.article_id} 
      xs={12} sm={12} md={6} lg={4} xl={4} 
      className="d-flex"
    >
      <a 
        href={article.link} 
        className="unstyled-link d-flex flex-column flex-fill"
      >
        <Card className={`news-card-${theme} h-100 mb-3`}>
          {article.image_url ? (
            <Card.Img 
              variant="top" 
              src={article.image_url} 
              className="object-fit-cover"
            />
          ) : (
            <Card.Img 
              variant="top" 
              src={altImageURL} 
              className="object-fit-cover"
            />
          )}
          <Card.Body className="d-flex flex-column">
            <Card.Text className="fw-bold">
              {loading ? "..." : displayData.title}
            </Card.Text>
            <Card.Text className="truncate-text mt-auto">
              {loading ? "Translating..." : displayData.description}
            </Card.Text> 
          </Card.Body>
        </Card>
      </a>
    </Col>
  );
}

export default NewsCard;