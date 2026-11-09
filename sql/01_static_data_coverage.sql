
-- How much of the vessels table has the new static fields filled?

SELECT
    COUNT(*) AS total,
    COUNT(callsign) AS with_callsign,
    ROUND(100.0 * COUNT(callsign) / COUNT(*), 1) AS pct_callsign, -- percentage
    COUNT(destination) AS with_destination,
    ROUND(100.0 * COUNT(destination) / COUNT(*), 1) AS pct_destination,
    COUNT(draught) AS with_draught,
    ROUND(100.0 * COUNT(draught) / COUNT(*), 1) AS pct_draught
FROM vessels;