<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit();
}

$stmt = mysqli_prepare($conn, "SELECT admin_id, admin_email, admin_password FROM admins WHERE admin_email = ?");
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$admin  = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);
mysqli_close($conn);

if ($admin && password_verify($password, $admin['admin_password'])) {
    session_regenerate_id(true);
    $_SESSION['admin_id']    = $admin['admin_id'];
    $_SESSION['admin_email'] = $admin['admin_email'];

    echo json_encode([
        'success' => true,
        'admin'   => ['email' => $admin['admin_email']],
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid admin credentials.']);
}

exit();
