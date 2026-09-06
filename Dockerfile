FROM php:8.2-apache

# Enable Apache modules for URL rewriting
RUN a2enmod rewrite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy entire project
COPY . .

# Install PHP backend dependencies
WORKDIR /var/www/html/Backend
RUN composer install --no-dev --optimize-autoloader

# Set Apache document root to Backend/public
WORKDIR /var/www/html
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/Backend/public|g' /etc/apache2/sites-available/000-default.conf

# Create .htaccess for routing
RUN echo '<Directory /var/www/html/Backend/public>' >> /etc/apache2/apache2.conf && \
    echo '    AllowOverride All' >> /etc/apache2/apache2.conf && \
    echo '    Require all granted' >> /etc/apache2/apache2.conf && \
    echo '</Directory>' >> /etc/apache2/apache2.conf

# Copy Frontend assets to be served
RUN mkdir -p /var/www/html/Backend/public/app && \
    cp /var/www/html/index.html /var/www/html/Backend/public/app/ && \
    cp /var/www/html/map.html /var/www/html/Backend/public/app/ && \
    cp -r /var/www/html/Frontend /var/www/html/Backend/public/app/frontend 2>/dev/null || true

# Create startup script
RUN echo '#!/bin/bash\n\
echo "[Startup] Initializing database..."\n\
php /var/www/html/init-db.php\n\
echo "[Startup] Starting Apache..."\n\
apache2-foreground' > /start.sh && chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start Apache with DB initialization
CMD ["/start.sh"]

