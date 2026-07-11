<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

$username = trim($_POST['username'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$gender   = $_POST['gender'] ?? '';
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';
$terms    = isset($_POST['terms']);

$errors = [];

if (empty($username) || empty($phone) || empty($gender) || empty($email) || empty($password) || empty($confirm_password)) {
    $errors[] = "All fields are required.";
} elseif (!$terms) {
    $errors[] = "You must accept the Terms of Service.";
} elseif (!preg_match("/^[a-zA-Z]+$/", $username)) {
    $errors[] = "Username must contain letters only.";
} elseif (!in_array($gender, ['male', 'female'], true)) {
    $errors[] = "Please select a valid gender.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address.";
} elseif (strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters.";
} elseif (!preg_match('/[A-Z]/', $password)) {
    $errors[] = "Password must contain at least one uppercase letter.";
} elseif (!preg_match('/[0-9]/', $password)) {
    $errors[] = "Password must contain at least one number.";
} elseif ($password !== $confirm_password) {
    $errors[] = "Passwords do not match.";
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit();
}

// Check if email already exists
$checkStmt = mysqli_prepare($conn, "SELECT user_id FROM users WHERE user_email = ?");
mysqli_stmt_bind_param($checkStmt, 's', $email);
mysqli_stmt_execute($checkStmt);
mysqli_stmt_store_result($checkStmt);

if (mysqli_stmt_num_rows($checkStmt) > 0) {
    echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
    mysqli_stmt_close($checkStmt);
    exit();
}
mysqli_stmt_close($checkStmt);

// Insert user
$hash = password_hash($password, PASSWORD_DEFAULT);
$phoneInt = (int) preg_replace('/[^0-9]/', '', $phone);

$insertStmt = mysqli_prepare($conn, "INSERT INTO users (username, user_email, user_password, gender, phone) VALUES (?, ?, ?, ?, ?)");
mysqli_stmt_bind_param($insertStmt, 'ssssi', $username, $email, $hash, $gender, $phoneInt);

if (mysqli_stmt_execute($insertStmt)) {
    $userId = mysqli_insert_id($conn);

    // Create profile
    $profileStmt = mysqli_prepare($conn, "INSERT INTO profiles (user_id, username, gender, phone) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($profileStmt, 'isss', $userId, $username, $gender, $phone);
    mysqli_stmt_execute($profileStmt);
    mysqli_stmt_close($profileStmt);

    mysqli_stmt_close($insertStmt);

    echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    mysqli_stmt_close($insertStmt);
}

mysqli_close($conn);
