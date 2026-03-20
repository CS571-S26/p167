import { Card, Col } from "react-bootstrap"
import type { Article } from "../types"
import ThemeContext from "../contexts/ThemeContext"
import { useContext } from "react"

interface NewsCardProps {
  article: Article; 
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const [theme] = useContext(ThemeContext) || ["dark"];
    const altImageURL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"

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
          <Card.Text className="fw-bold">{article.title}</Card.Text>
          <Card.Text className="truncate-text mt-auto">
            {article.description}
          </Card.Text> 
        </Card.Body>
      </Card>
    </a>
  </Col>
);
}

export default NewsCard;