import { serve } from "std/server"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { isoCode, countryLanguage, category } = await req.json()

    // This is the line that actually retrieves the API key from Supabase
    const API_KEY = Deno.env.get('NEWSDATA_API_KEY')

    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=${isoCode}&language=${countryLanguage}&category=domestic,${category}&removeduplicate=1&datatype=news`

    const response = await fetch(url)
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})