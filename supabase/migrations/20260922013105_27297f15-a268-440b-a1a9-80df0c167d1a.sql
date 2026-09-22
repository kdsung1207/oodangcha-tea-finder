CREATE TABLE public.signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 2 AND 100),
  tea_result text NOT NULL CHECK (tea_result IN ('루이보스차','홍차','보이차','우롱차','말차','호지차','히비스커스티')),
  timeslot text NOT NULL CHECK (timeslot IN ('13:00','14:00','15:00','16:00')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.signups TO service_role;
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;
CREATE INDEX signups_timeslot_created_at_idx ON public.signups (timeslot, created_at);

CREATE OR REPLACE FUNCTION public.reserve_tea_timeslot(
  p_name text,
  p_contact text,
  p_tea_result text,
  p_timeslot text,
  p_capacity integer DEFAULT 8
) RETURNS public.signups
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted public.signups;
  current_count integer;
BEGIN
  IF p_name IS NULL OR char_length(btrim(p_name)) NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'invalid_name';
  END IF;
  IF p_contact IS NULL OR char_length(btrim(p_contact)) NOT BETWEEN 2 AND 100 THEN
    RAISE EXCEPTION 'invalid_contact';
  END IF;
  IF p_tea_result NOT IN ('루이보스차','홍차','보이차','우롱차','말차','호지차','히비스커스티') THEN
    RAISE EXCEPTION 'invalid_tea';
  END IF;
  IF p_timeslot NOT IN ('13:00','14:00','15:00','16:00') THEN
    RAISE EXCEPTION 'invalid_timeslot';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('odangcha:' || p_timeslot));
  SELECT count(*) INTO current_count FROM public.signups WHERE timeslot = p_timeslot;
  IF current_count >= p_capacity THEN
    RAISE EXCEPTION 'timeslot_full';
  END IF;

  INSERT INTO public.signups (name, contact, tea_result, timeslot)
  VALUES (btrim(p_name), btrim(p_contact), p_tea_result, p_timeslot)
  RETURNING * INTO inserted;
  RETURN inserted;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_tea_timeslot(text,text,text,text,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_tea_timeslot(text,text,text,text,integer) TO service_role;