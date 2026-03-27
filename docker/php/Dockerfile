FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www
