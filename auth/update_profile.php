<?php

session_start();
header("Content-Type: application/json");

include __DIR__ . '/../config/db.php';

if(!isset($_SESSION["user_id"])){

    echo json_encode([
        "success"=>false
    ]);

    exit();
}

$userId=$_SESSION["user_id"];

$username=trim($_POST["username"]);
$phone=trim($_POST["phone"]);
$gender=trim($_POST["gender"]);

$sql="UPDATE profiles
SET
username=?,
phone=?,
gender=?
WHERE user_id=?";

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

    mysqli_stmt_execute($userStmt);
    mysqli_stmt_close($userStmt);

    echo json_encode([
        "success"=>true
    ]);

}



else{

    echo json_encode([
        "success"=>false
    ]);

}

mysqli_stmt_close($stmt);
mysqli_close($conn);