import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Container, Row, Col} from 'react-bootstrap';
import NewsCard from "../NewsCard.tsx"
import type { APIResponse } from "../../types.ts"
import countryToLang from '../../languages.json';
import { supabase } from '../../supabaseClient.ts'
import ThemeContext from "../../contexts/ThemeContext.ts"

const News = () => {
  const [theme] = useContext(ThemeContext) || ["dark"];
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('top');
  const [data, setData] = useState<APIResponse | null>(null);
  const { countryName } = useParams<{ countryName: string }>(); // Get the country name from the URL
  const { stateName } = useParams<{stateName: string}>(); // Get the state name from the URL, if it is there
  const [searchParams] = useSearchParams();
  let isoCode: string = searchParams.get('iso') || ''; // Get the ISO short code for API fetch request
  const navigate = useNavigate();
  const countryLanguage = (countryToLang as Record<string, string>)[isoCode.toLowerCase()] || 'en';

  // TODO: Remove this when implementation of secondary API is done
  if(stateName) {
    return <h1>News for individual US States is coming soon</h1>
  }

  // Handle API issues
  if(isoCode == "SS") {
    isoCode = "SD"; // Fixes issue with South Sudan by showing Sudan news, South Sudan is not handled by the API properly
  }
  if (isoCode == "GL") {
    isoCode = "DK" // Convert Greenland's iso code to Denmark's, the API does not handle Greenland as a seperate country
  }

  // Get the data from the news API
  const fetchData = async () => {
    const { data, error } = await supabase.functions.invoke('news-proxy', {
      body: { 
        // Only passes the value if it exists
        isoCode: isoCode, 
        countryLanguage: countryLanguage,
        category: category,

        // Conditional logic for US States map
        ...(stateName && { 
          region: stateName,
          isoCode: "US"
        })
      }
    })

  if (error) {
    console.error('Error fetching news:', error)
  } else {
    setData(data);
    setLoading(false);
  }
}

// Reload the page on initial mount and when the user selects a new category
useEffect(() => {
  fetchData();
  }, [category]);

  return (
    <Container className={`news-page-${theme}`}>
      <h1>News for {countryName}</h1>
      <Button 
        variant="primary"
        onClick={() => navigate('/worldmap')}
        className="rounded-pill px-4 me-2 shadow-sm"
      >
        Back to Map
      </Button>
      
      <hr/>
      {/* Category Filters */}
      <div className="category-filters mb-4">
        <Button 
          variant={category === 'top' ? 'primary' : 'outline-primary'}
          onClick={() => setCategory('top')}
          className="rounded-pill px-4 me-2 shadow-sm"
        >
          Top News
        </Button>

        <Button 
          variant={category === 'politics' ? 'primary' : 'outline-primary'} 
          onClick={() => setCategory('politics')}
          className="rounded-pill px-4 me-2 shadow-sm"
        >
          Politics
        </Button>

        <Button 
          variant={category === 'technology' ? 'primary' : 'outline-primary'} 
          onClick={() => setCategory('technology')}
          className="rounded-pill px-4 me-2 shadow-sm"
        >
          Tech
        </Button>
      </div>
      
      {loading ? 
      (
      <Row>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Col key={i} xs={12} sm={12} md={6} lg={4} xl={4} className="mb-4">
            <div className="skeleton-card" style={{ height: '300px', background: '#eee', borderRadius: '8px' }} />
          </Col>
        ))}
      </Row>
      )
      :
      <div>
      {data && data.results && data.results.length > 0 ?
      <Row>{data.results.map(s => <NewsCard key={s.article_id} article={s} />)}</Row> :
      stateName 
        ? <p>There is no current news for {stateName}</p>
        : <p>There is no current news for {countryName}</p>
      }
      </div>
    }
     
    </Container>
  );
};

export default News;