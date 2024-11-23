import express from "npm:express@4.18.2"
import cors from "npm:cors@2.8.5"
import logger  from 'npm:morgan@1.10.0'
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'



await load({export: true})


const config = {
  PORT: Deno.env.get('PORT') ?? 5555,
  ENV: Deno.env.get('ENV') ?? 'dev',
  SUPABASE_URL: Deno.env.get('SUPABASE_URL') ?? '',
  SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
}




const app = express()
app.use(cors())
app.use(express.json())

app.use(logger(
  '[:date[web]] :method :url :status :response-time ms - :res[content-length]',
  { skip: (req, res) => req.originalUrl === '/favicon.ico' }
))


app.use((req, res, next) => {
  req.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
  next()
})


app.get('/health', async (req, res) => {
  res.send('ok')
})

app.post('/snapshots', async (req, res) => {
  const { data, error } = await req.supabase
    .from('sessions')
    .upsert({
      id: req.body.id,
      snapshot: req.body.snapshot
    })
    .select()
})






app.listen(config.PORT, (err) => {
  if (err) throw new Error(`Something went wrong with express: ${err.message}`);
  console.log('Server started', new Date());
  console.log(`Running on port: ${config.PORT}`)
  console.log(`Running DENO ENV: ${config.ENV}`);
})