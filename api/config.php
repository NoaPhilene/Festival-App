<?php
// $host    = '127.0.0.1';
// $db      = 'festival-app';
// $user    = 'root';
// $pass    = '';
// $charset = 'utf8mb4';

$host = '172.19.0.2';
$db      = 'festival-app';
$user    = 'root';
$pass    = 'QLctiRUcLUbR9jHO9nss';
$charset = 'utf8mb4';


$dsn     = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
