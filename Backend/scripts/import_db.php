<?php
// Import the SQL schema into MySQL using mysqli, creating the DB if needed
$host = 'localhost';
$user = 'root';
$pass = '';
$dbName = 'parc_national';
$sqlFile = __DIR__ . '/../../parc_national.sql';

if (!file_exists($sqlFile)) {
    fwrite(STDERR, "SQL file not found: {$sqlFile}\n");
    exit(1);
}

$mysqli = mysqli_init();
if (!$mysqli->real_connect($host, $user, $pass)) {
    fwrite(STDERR, "Connection failed: " . mysqli_connect_error() . "\n");
    exit(1);
}

// Create database if not exists
if (!$mysqli->query("CREATE DATABASE IF NOT EXISTS `{$dbName}`")) {
    fwrite(STDERR, "Failed to create database: " . $mysqli->error . "\n");
    exit(1);
}

// Select database
if (!$mysqli->select_db($dbName)) {
    fwrite(STDERR, "Failed to select database: " . $mysqli->error . "\n");
    exit(1);
}

$sql = file_get_contents($sqlFile);
if ($sql === false) {
    fwrite(STDERR, "Failed to read SQL file.\n");
    exit(1);
}

// Run multi query for the full file contents
if (!$mysqli->multi_query($sql)) {
    fwrite(STDERR, "Import failed: " . $mysqli->error . "\n");
    exit(1);
}

// Consume results to finish multi_query
do {
    if ($result = $mysqli->store_result()) {
        $result->free();
    }
} while ($mysqli->more_results() && $mysqli->next_result());

echo "Database '{$dbName}' imported successfully from parc_national.sql\n";