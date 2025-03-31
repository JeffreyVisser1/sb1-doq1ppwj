/*
  # Create function for study statistics

  1. New Function
    - `get_study_statistics`
      - Input: hours_ago (integer)
      - Returns: Record with statistics about study processing
        - avg_wait_time (float)
        - total_processed (bigint)
        - success_rate (float)

  2. Purpose
    - Calculates statistics for studies processed within the specified time window
    - Includes average wait time, total processed studies, and success rate
*/

CREATE OR REPLACE FUNCTION get_study_statistics(hours_ago integer)
RETURNS TABLE (
  avg_wait_time float,
  total_processed bigint,
  success_rate float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(EPOCH FROM AVG(completed_at - created_at))/60 as avg_wait_time,
    COUNT(*) as total_processed,
    (COUNT(CASE WHEN status = 'results_received' THEN 1 END)::float / COUNT(*)::float) as success_rate
  FROM study_status
  WHERE created_at >= NOW() - (hours_ago || ' hours')::interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;