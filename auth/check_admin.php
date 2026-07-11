<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => true, 'admin_id' => (int)$_SESSION['admin_id']]);
} else {
    echo json_encode(['success' => false]);
}
