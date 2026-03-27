import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const body = await req.json()
    const { action, email, password, token, first_name, last_name, phone, church_name } = body

    // REGISTER
    if (action === 'register') {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { first_name, last_name }
      })
      if (authError) return new Response(JSON.stringify({ error: authError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      await supabase.from('profiles').upsert({
        user_id: authData.user.id,
        email,
        first_name,
        last_name,
        phone,
        church_name,
        role: 'member',
        membership_status: 'pending'
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // LOGIN
    if (action === 'login') {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single()

      if (!profile) return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      const sessionToken = crypto.randomUUID() + '-' + crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await supabase.from('member_sessions').insert({
        profile_id: profile.id,
        token: sessionToken,
        expires_at: expiresAt
      })

      return new Response(JSON.stringify({ token: sessionToken, profile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // VALIDATE
    if (action === 'validate') {
      const { data: session } = await supabase
        .from('member_sessions')
        .select('*, profile:profiles(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (!session) return new Response(JSON.stringify({ valid: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      return new Response(JSON.stringify({ valid: true, profile: session.profile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // LOGOUT
    if (action === 'logout') {
      await supabase.from('member_sessions').delete().eq('token', token)
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
