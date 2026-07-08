<?php

include '../config/db.php';

$email = $_POST['email'];
$password = $_POST['password'];

$hashedPassword =
password_hash($password,PASSWORD_DEFAULT);

$sql = "INSERT INTO users
(u_email,u_password)

VALUES (?,?)";

$stmt = mysqli_prepare($conn,$sql);
echo $conn;

mysqli_stmt_bind_param(
$stmt,
"ss",
$email,
$hashedPassword
);

mysqli_stmt_execute($stmt);

header("Location: login.php");

?>