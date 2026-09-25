#!/bin/bash
# ==========================================================
# Kafedralar.uz — Deploy Script
# Serverda yangi kodni o'rnatish uchun ishlatiladi.
# Foydalanish: bash deploy.sh
# ==========================================================

set -e  # Xatolik bo'lsa to'xtatish

# Loyiha papkasi (o'zingiznikiga o'zgartiring)
PROJECT_DIR="${PROJECT_DIR:-/var/www/kafedra_uz}"

cd "$PROJECT_DIR"

echo ""
echo "=========================================="
echo "  🚀 Kafedralar.uz Deploy Boshlanmoqda"
echo "=========================================="
echo ""

# 1. Kodni yangilash
echo "📥 [1/5] Git pull..."
git pull origin main

# 2. Paketlarni o'rnatish
echo "📦 [2/5] Pip install..."
pip install -r requirements.txt --quiet

# 3. Migratsiya
echo "🗄️  [3/5] Migrate..."
python manage.py migrate --noinput

# 4. Static fayllarni yig'ish (MUHIM!)
echo "🎨 [4/5] Collectstatic..."
python manage.py collectstatic --noinput --clear

# 5. Serverni restart
echo "🔄 [5/5] Restart..."
if systemctl is-active --quiet kafedra; then
    sudo systemctl restart kafedra
    echo "   ✅ kafedra service restarted"
elif systemctl is-active --quiet gunicorn; then
    sudo systemctl restart gunicorn
    echo "   ✅ gunicorn restarted"
else
    echo "   ⚠️  Servis topilmadi. Qo'lda restart qiling."
fi

# Nginx reload
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    echo "   ✅ nginx reloaded"
fi

echo ""
echo "=========================================="
echo "  ✅ Deploy muvaffaqiyatli tugadi!"
echo "=========================================="
echo ""
