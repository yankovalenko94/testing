# ==========================================
# ЭТАП 1: Сборка (Builder)
# Собираем приложение Vite + React
# ==========================================
FROM node:20-alpine AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Кэшируем установку зависимостей (npm ci) на основе package.json/package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Копируем весь исходный код и строим проект
COPY . .
RUN npm run build

# ==========================================
# ЭТАП 2: Раздача статики (Runner)
# Легковесный Nginx для отдачи собранного приложения
# ==========================================
FROM nginx:alpine AS runner

# Копируем собранные файлы из предыдущего шага
COPY --from=builder /app/dist /usr/share/nginx/html

# (Опционально) Для SPA (React Router) можно добавить конфиг:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx стартует по умолчанию
