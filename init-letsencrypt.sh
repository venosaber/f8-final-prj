#!/bin/bash

# =============================================================================
# init-letsencrypt.sh
# One-time script to bootstrap SSL certificates for a fresh VPS deployment.
# Run this ONCE before `docker compose up -d`.
# =============================================================================

set -e

# ── Load config from .env ────────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "❌ .env file not found. Copy .env.example to .env and fill in your values."
  exit 1
fi

DOMAIN=$(grep '^VITE_DOMAIN=' .env | cut -d '=' -f2)
EMAIL=$(grep '^EMAIL=' .env | cut -d '=' -f2)

if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "localhost" ]; then
  echo "❌ VITE_DOMAIN is not set or is 'localhost'. Set it to your real domain in .env"
  exit 1
fi

if [ -z "$EMAIL" ]; then
  echo "❌ EMAIL is not set in .env. Certbot needs an email for certificate notifications."
  exit 1
fi

DOMAINS=($DOMAIN www.$DOMAIN)
CERT_PATH="./certbot/conf/live/$DOMAIN"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SSL Bootstrap for: $DOMAIN"
echo "  Email: $EMAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: Create dummy certificate so nginx can start ──────────────────────
echo ""
echo "📦 Step 1/4: Creating dummy certificate..."
mkdir -p "$CERT_PATH"

docker compose run --rm --entrypoint openssl certbot \
  req -x509 -nodes -newkey rsa:4096 -days 1 \
  -keyout "/etc/letsencrypt/live/$DOMAIN/privkey.pem" \
  -out "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" \
  -subj "/CN=localhost"

echo "   ✅ Dummy certificate created"

# ── Step 2: Start nginx ─────────────────────────────────────────────────────
echo ""
echo "🚀 Step 2/4: Starting nginx..."
docker compose up -d nginx
echo "   ✅ Nginx started"

# Wait for nginx to be ready
sleep 3

# ── Step 3: Remove dummy certificate and request real one ────────────────────
echo ""
echo "🗑️  Step 3/4: Removing dummy certificate..."
docker compose run --rm --entrypoint sh certbot -c \
  "rm -rf /etc/letsencrypt/live/$DOMAIN && \
   rm -rf /etc/letsencrypt/archive/$DOMAIN && \
   rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf"
echo "   ✅ Dummy certificate removed"

echo ""
echo "🔐 Step 4/4: Requesting real certificate from Let's Encrypt..."

# Build the -d flags for each domain
DOMAIN_ARGS=""
for d in "${DOMAINS[@]}"; do
  DOMAIN_ARGS="$DOMAIN_ARGS -d $d"
done

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  -w /var/www/html/certbot \
  $DOMAIN_ARGS \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal

echo "   ✅ Real certificate obtained!"

# ── Step 4: Reload nginx with real certificate ───────────────────────────────
echo ""
echo "🔄 Reloading nginx with real certificate..."
docker compose exec nginx nginx -s reload
echo "   ✅ Nginx reloaded"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ SSL setup complete!"
echo ""
echo "  Now run:  docker compose up -d"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
