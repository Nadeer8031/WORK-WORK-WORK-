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

$sql = "SELECT u_id, u_email, u_password FROM users WHERE u_email = ?";
$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
    exit();
}

mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

mysqli_stmt_close($stmt);
mysqli_close($conn);

if ($user && password_verify($password, $user['u_password'])) {
    // Regenerate the session id on login to help prevent session fixation
    session_regenerate_id(true);

    $_SESSION['user_id'] = $user['u_id'];
    $_SESSION['user_email'] = $user['u_email'];

    echo json_encode([
        'success' => true,
        'user' => [
            'email' => $user['u_email'],
        ],
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect email or password.']);
}

exit();

?>
