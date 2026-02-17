-- FUNCTION TO INCREMENT POINTS
-- This allows us to atomically increment a user's points.

CREATE OR REPLACE FUNCTION increment_points(user_id TEXT, amount INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + amount
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
