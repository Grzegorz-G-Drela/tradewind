# Server Hardening

## fail2ban
Installed and active. Watches SSH login attempts via journald, bans IPs after repeated failed logins.

## UFW firewall
Installed and enabled. Default: deny all incoming, allow all outgoing.
Only exception: SSH (port 22) allowed in, so remote admin access is preserved.
Public web traffic reaches the app via Cloudflare Tunnel (outbound connection, not a firewall rule) - no other ports need to be open.

Confirmed via 'sudo yfw status verbose':
22/tcp                     ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)

## Verified
- SSH sttill reachable after enabling UFW
- Public site (tradewindmaritime.com) still functional after enabling UFW
