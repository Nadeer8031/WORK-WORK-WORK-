<?php
if (!isset($_SESSION)) {
    session_start();
}

// Use shared DB connection
require_once __DIR__ . '/../config/db.php';

$errors = [];

if (isset($_POST['submit'])) {

    $username         = mysqli_real_escape_string($conn, trim($_POST['username'] ?? ''));
    $phone            = mysqli_real_escape_string($conn, trim($_POST['phone'] ?? ''));
    $gender           = mysqli_real_escape_string($conn, trim($_POST['gender'] ?? ''));
    $email            = mysqli_real_escape_string($conn, trim($_POST['email'] ?? ''));
    $password         = trim($_POST['password'] ?? '');
    $confirm_password = trim($_POST['confirm_password'] ?? '');

    // --- Validation ---
    if (empty($username)) {
        $errors[] = "Username is required.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "A valid email address is required.";
    }

    if (empty($phone)) {
        $errors[] = "Phone number is required.";
    }

    if (empty($gender)) {
        $errors[] = "Please select a gender.";
    }

    if (empty($password)) {
        $errors[] = "Password is required.";
    } elseif (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match.";
    }

    // Check if email already exists
    if (count($errors) === 0) {
        $check = mysqli_query($conn, "SELECT user_id FROM users WHERE user_email = '$email' LIMIT 1");
        if ($check && mysqli_num_rows($check) > 0) {
            $errors[] = "An account with this email already exists.";
        }
    }

    // --- Insert ---
    if (count($errors) === 0) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, phone, gender, user_email, user_password)
                VALUES ('$username', '$phone', '$gender', '$email', '$hashed_password')";

        if (mysqli_query($conn, $sql)) {
            $_SESSION['success'] = "Account created successfully! Please log in.";
            header('Location: ../login.html');
            exit();
        } else {
            $errors[] = "Registration failed: " . mysqli_error($conn);
        }
    }

    // Return errors as JSON if there are any (for JS handling), or redirect back
    $_SESSION['register_errors'] = $errors;
    $_SESSION['register_old']    = compact('username', 'phone', 'gender', 'email');
    header('Location: ../signup.html');
    exit();
}
?>