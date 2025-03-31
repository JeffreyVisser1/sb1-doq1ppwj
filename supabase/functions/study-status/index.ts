import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StudyStatus {
  status: string;
  timestamp: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false }
      }
    );

    // Query for study status
    const { data: statusData, error: statusError } = await supabaseClient
      .from('study_status')
      .select('status, timestamp')
      .eq('study_token', token)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle(); // ✅ Fix: Handles empty result

    if (statusError) {
      console.error('Status query error:', statusError);
      throw statusError;
    }

    // Query for statistics
    const { data: statsData, error: statsError } = await supabaseClient.rpc(
      'get_study_statistics',
      { hours_ago: 24 }
    );

    if (statsError) {
      console.error('Statistics query error:', statsError);
      throw statsError;
    }

    const response = {
      status: statusData || null,  // ✅ Handles empty result
      statistics: {
        averageWaitTime: Math.round(statsData?.avg_wait_time || 0),
        estimatedQueueTime: Math.round((statsData?.avg_wait_time || 0) * 0.8),
        totalProcessed: statsData?.total_processed || 0,
        successRate: Math.round((statsData?.success_rate || 0) * 100) / 100,
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
