import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'



const config = {
  PORT: Deno.env.get('PORT') ?? 5555,
  ENV: Deno.env.get('ENV') ?? 'dev',
  SUPABASE_URL: Deno.env.get('SUPABASE_URL') ?? '',
  SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
}


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id, error } = await req.json()
    const supabase = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error: err } = await supabase
      .from('errors')
      .insert({ error, session_id })
      .select()


    if (err) {
      console.log(err)
      return new Response(
        JSON.stringify({ error: err }),
        { headers: { "Content-Type": "application/json" } },
      )
    } else {
      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }
  } catch (e) {
    console.log(e)
    return new Response(
      JSON.stringify({ error: e.message }),
      { headers: { "Content-Type": "application/json" } },
    )
  }
})
