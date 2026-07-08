<?php

session_start();
header('Content-Type: application/json');
include '../config/db.php';

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit();
}

// Make sure this email isn't already registered
$checkSql = "SELECT u_id FROM users WHERE u_email = ?";
$checkStmt = mysqli_prepare($conn, $checkSql);
mysqli_stmt_bind_param($checkStmt, "s", $email);
mysqli_stmt_execute($checkStmt);
mysqli_stmt_store_result($checkStmt);

if (mysqli_stmt_num_rows($checkStmt) > 0) {
    mysqli_stmt_close($checkStmt);
    echo json_encode(['success' => false, 'message' => 'An account with that email already exists.']);
    exit();
}
mysqli_stmt_close($checkStmt);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (u_email, u_password) VALUES (?, ?)";
$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
    exit();
}

mysqli_stmt_bind_param($stmt, "ss", $email, $hashedPassword);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    // Auto-login right after registering
    session_regenerate_id(true);
    $_SESSION['user_id'] = $newId;
    $_SESSION['user_email'] = $email;

    echo json_encode(['success' => true, 'user' => ['email' => $email]]);
} else {
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    echo json_encode(['success' => false, 'message' => 'Could not create your account. Please try again.']);
}

exit();

?>
