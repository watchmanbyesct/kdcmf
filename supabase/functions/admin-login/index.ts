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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const { action, email, password, token } = await req.json()

    if (action === 'check_email') {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, photo_url')
        .eq('email', email.toLowerCase().trim())
        .in('role', ['admin', 'staff'])
        .maybeSingle()

      if (error || !profile) return new Response(JSON.stringify({ exists: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      return new Response(JSON.stringify({ exists: true, profile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'login') {
      // Verify password using SQL function (avoids 403 from signInWithPassword)
      const { data: passwordValid, error: verifyError } = await supabase.rpc('verify_user_password', {
        user_email: email.toLowerCase().trim(),
        user_password: password
      })

      if (verifyError || !passwordValid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .in('role', ['admin', 'staff'])
        .maybeSingle()

      if (!profile) return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      const sessionToken = crypto.randomUUID() + '-' + crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()

      await supabase.from('admin_sessions').insert({
        profile_id: profile.id,
        token: sessionToken,
        expires_at: expiresAt
      })

      return new Response(JSON.stringify({ token: sessionToken, profile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'validate') {
      const { data: session } = await supabase
        .from('admin_sessions')
        .select('*, profile:profiles(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (!session) return new Response(JSON.stringify({ valid: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

      return new Response(JSON.stringify({ valid: true, profile: session.profile }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'logout') {
      await supabase.from('admin_sessions').delete().eq('token', token)
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
