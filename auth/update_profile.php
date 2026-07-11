<?php

session_start();
header("Content-Type: application/json");

include __DIR__ . '/../config/db.php';

<<<<<<< HEAD
if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false
=======
if(!isset($_SESSION["user_id"])){

    echo json_encode([
        "success"=>false
>>>>>>> d9a8e223b93787d047bf28b01ae134ecf793f383
    ]);

    exit();
}

<<<<<<< HEAD
$userId = $_SESSION["user_id"];

$username = trim($_POST["username"] ?? '');
$email    = trim($_POST["email"] ?? '');
$phone    = trim($_POST["phone"] ?? '');
$gender   = trim($_POST["gender"] ?? '');

// Email is edited from the same form but was previously never sent to the
// server (or persisted anywhere) even though the UI made it look editable.
// Validate it and make sure it doesn't collide with another account.
if ($email !== '') {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email address."
        ]);
        exit();
    }

    $checkStmt = mysqli_prepare($conn, "SELECT user_id FROM users WHERE user_email = ? AND user_id != ?");
    mysqli_stmt_bind_param($checkStmt, "si", $email, $userId);
    mysqli_stmt_execute($checkStmt);
    mysqli_stmt_store_result($checkStmt);
    if (mysqli_stmt_num_rows($checkStmt) > 0) {
        mysqli_stmt_close($checkStmt);
        echo json_encode([
            "success" => false,
            "message" => "That email is already in use by another account."
        ]);
        exit();
    }
    mysqli_stmt_close($checkStmt);
}

$sql = "UPDATE profiles
=======
$userId=$_SESSION["user_id"];

$username=trim($_POST["username"]);
$phone=trim($_POST["phone"]);
$gender=trim($_POST["gender"]);

$sql="UPDATE profiles
>>>>>>> d9a8e223b93787d047bf28b01ae134ecf793f383
SET
username=?,
phone=?,
gender=?
WHERE user_id=?";

<<<<<<< HEAD
$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssi",
    $username,
    $phone,
    $gender,
    $userId
);

if (mysqli_stmt_execute($stmt)) {

    // Also update users table (username, gender, and now email)
    if ($email !== '') {
        $userSql = "UPDATE users
                    SET username = ?,
                        gender = ?,
                        user_email = ?
                    WHERE user_id = ?";

        $userStmt = mysqli_prepare($conn, $userSql);

        mysqli_stmt_bind_param(
            $userStmt,
            "sssi",
            $username,
            $gender,
            $email,
            $userId
        );
    } else {
        $userSql = "UPDATE users
                    SET username = ?,
                        gender = ?
                    WHERE user_id = ?";

        $userStmt = mysqli_prepare($conn, $userSql);

        mysqli_stmt_bind_param(
            $userStmt,
            "ssi",
            $username,
            $gender,
            $userId
        );
    }
=======
$stmt=mysqli_prepare($conn,$sql);

mysqli_stmt_bind_param(
$stmt,
"sssi",
$username,
$phone,
$gender,
$userId
);

if(mysqli_stmt_execute($stmt)){

    // تحديث جدول users أيضاً
    $userSql = "UPDATE users
                SET username = ?,
                    phone = ?,
                    gender = ?
                WHERE user_id = ?";

    $userStmt = mysqli_prepare($conn, $userSql);

    mysqli_stmt_bind_param(
        $userStmt,
        "sssi",
        $username,
        $phone,
        $gender,
        $userId
    );
>>>>>>> d9a8e223b93787d047bf28b01ae134ecf793f383

    mysqli_stmt_execute($userStmt);
    mysqli_stmt_close($userStmt);

<<<<<<< HEAD
    // Keep the session email in sync so get_profile.php / other checks
    // reflect the change immediately without requiring a re-login.
    if ($email !== '') {
        $_SESSION['user_email'] = $email;
    }

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false
=======
    echo json_encode([
        "success"=>true
    ]);

}



else{

    echo json_encode([
        "success"=>false
>>>>>>> d9a8e223b93787d047bf28b01ae134ecf793f383
    ]);

}

mysqli_stmt_close($stmt);
<<<<<<< HEAD
mysqli_close($conn);
=======
mysqli_close($conn);
>>>>>>> d9a8e223b93787d047bf28b01ae134ecf793f383
