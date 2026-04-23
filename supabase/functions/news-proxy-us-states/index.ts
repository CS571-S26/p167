import type { NewsAPIArticle, Article} from "../../../src/news-types.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const mapNewsToArticle = (news: NewsAPIArticle, category: string): Article => {
  return {
    // NewsAPI doesn't provide a unique ID, so the URL is the safest unique identifier
    article_id: news.url || crypto.randomUUID(), 
    title: news.title,
    link: news.url || '',
    description: news.description || undefined,
    image_url: news.urlToImage,
    pubDate: news.publishedAt,
    source_name: news.source.name,
    category: [category], 
  };
};

Deno.serve(async (req) => {
  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200, 
      headers: corsHeaders 
    })
  }

  try {
    // Parse the body
    const { category, stateName } = await req.json()

    const API_KEY = Deno.env.get('NEWSAPI_API_KEY')
    if (!API_KEY) throw new Error("Missing API Key")

    const url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&q="${stateName}" AND ${category}`

    const response = await fetch(url)
    const data = await response.json()

    const formattedArticles: Article[] = data.articles.map((item: NewsAPIArticle) => 
      mapNewsToArticle(item, category)
    );

    // Return successful response with CORS headers
    return new Response(JSON.stringify(formattedArticles), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})