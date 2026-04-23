// This file calls the Google Translate Cloud API to translate the titles and descriptions of the news stories

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Point to  localhost or domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
  return new Response('ok', { 
    status: 200,
    headers: corsHeaders 
  })
}

  try {
    const { text, targetLanguage } = await req.json() // 'text' can be a string OR an array
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY')
    if (!apiKey) throw new Error("Missing API Key")

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text, // Google API accepts string[] here
          target: targetLanguage,
          format: 'text'
        }),
      }
    )

    const data = await response.json()

    // Output error for debugging purposes
    if (!response.ok) {
      console.error("Google API Error Details:", data);
      return new Response(
        JSON.stringify({ 
          error: "Google API Error", 
          details: data.error?.message || "Unknown Google Error" 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const translations = data.data.translations.map(
      (t: { translatedText: string }) => t.translatedText
    );

    return new Response(
      JSON.stringify({ translations }), // Return the full array
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Use a type guard to safely access .message
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})