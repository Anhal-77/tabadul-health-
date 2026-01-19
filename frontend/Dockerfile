# Frontend Dockerfile for Mawrid Platform

# المرحلة الأولى: البناء
FROM node:18-alpine AS builder

WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت المكتبات
RUN npm ci

# نسخ باقي الملفات
COPY . .

# بناء التطبيق للإنتاج
RUN npm run build

# المرحلة الثانية: الإنتاج
FROM nginx:alpine

# نسخ ملف إعدادات nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# نسخ ملفات البناء من المرحلة الأولى
COPY --from=builder /app/dist /usr/share/nginx/html

# فتح المنفذ
EXPOSE 80

# تشغيل nginx
CMD ["nginx", "-g", "daemon off;"]
