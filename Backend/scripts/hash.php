<?php
// Utility script to generate a bcrypt hash for a known password
echo password_hash('Password123', PASSWORD_BCRYPT), PHP_EOL;