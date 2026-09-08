FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql \
    && a2enmod rewrite

# Serve the repo under /Parc-National-AAA-/ to match the app's hardcoded
# absolute paths (index.html, assets, API calls all use that prefix).
COPY . /var/www/html/Parc-National-AAA-/

RUN { \
    echo '<?php header("Location: /Parc-National-AAA-/index.html"); exit; ?>'; \
    } > /var/www/html/index.php \
    && rm -f /var/www/html/index.html

RUN { \
    echo '<Directory /var/www/html>'; \
    echo '    AllowOverride All'; \
    echo '    Require all granted'; \
    echo '</Directory>'; \
    } > /etc/apache2/conf-available/allow-override.conf \
    && a2enconf allow-override

EXPOSE 80
