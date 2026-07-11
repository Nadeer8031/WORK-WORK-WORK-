<?php
session_start();
header("Content-Type: application/json");

include __DIR__ . '/../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);
    exit();
}

$userId = $_SESSION['user_id'];

$sql = "SELECT
            u.username,
            u.user_email,
            p.phone,
            p.gender
        FROM users u
        JOIN profiles p
        ON u.user_id = p.user_id
        WHERE u.user_id = ?";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt,"i",$userId);

mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);

$user = mysqli_fetch_assoc($result);

echo json_encode([
    "success"=>true,
    "user"=>$user
]);

mysqli_stmt_close($stmt);
mysqli_close($conn);