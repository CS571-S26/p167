const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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
    const { isoCode, countryLanguage, category } = await req.json()

    const API_KEY = Deno.env.get('NEWSDATA_API_KEY')
    if (!API_KEY) throw new Error("Missing API Key")

    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=${isoCode}&language=${countryLanguage}&category=domestic,${category}&removeduplicate=1&datatype=news`

    const response = await fetch(url)
    const data = await response.json()

    // Return successful response with CORS headers
    return new Response(JSON.stringify(data), {
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