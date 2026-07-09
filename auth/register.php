<?php

include __DIR__ . '/../config/db.php';
/** @var mysqli $conn */


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $values = $_POST;

        $username = mysqli_real_escape_string($conn, trim($_POST['username']));
        $phone = mysqli_real_escape_string($conn, trim($_POST['phone']));
        $gender = mysqli_real_escape_string($conn, $_POST['gender']);
        $email = mysqli_real_escape_string($conn, trim($_POST['email']));
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        $terms = isset($_POST['terms']);

        $errorMsg = [];
        // $$emailErr = "";
        
        if(empty($username) || empty($phone) || empty($gender) || empty($email) || empty($password) || empty($confirm_password)){

            $errorMsg[] = "You must fill all the fields!";

        } elseif (!$terms) {
            
            $errorMsg[] = "Please accept the Terms.";

        } elseif(!preg_match("/^[a-zA-Z]+$/", $username)){
            $errorMsg[] = "Name must contain letters only!";

        } elseif (!in_array($gender, ['male', 'female'], true)) {
            $errorMsg[] = "Please select a valid gender.";

        } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            
            $errorMsg[] = "Invalid email!";

        } elseif(strlen($password) < 8){
            
            $errorMsg[] = "Password must be at least 8 characters!";

        } elseif($password !== $confirm_password){
            
            $errorMsg[] = "Passwords don't match!";

        } else{

            $checkSql = "SELECT user_id FROM users WHERE user_email = ?";
            $checkStmt = mysqli_prepare($conn, $checkSql);

            if ($checkStmt) {
                mysqli_stmt_bind_param($checkStmt, 's', $email);
                mysqli_stmt_execute($checkStmt);
                mysqli_stmt_store_result($checkStmt);

                if (mysqli_stmt_num_rows($checkStmt) > 0) {
                    $errorMsg[] = "The email already exists";
                }

                mysqli_stmt_close($checkStmt);
            } else {
                $errorMsg[] = "Server error. Please try again.";
            }

            if (empty($errorMsg)) {
                $hashpassword = password_hash($password, PASSWORD_DEFAULT);

                $insertSql = "INSERT INTO users (username, gender, phone, user_email, user_password)
                            VALUES (?, ?, ?, ?, ?)";
                $insertStmt = mysqli_prepare($conn, $insertSql);

                if ($insertStmt) {
                    mysqli_stmt_bind_param($insertStmt, 'sssss', $username, $gender, $phone, $email, $hashpassword);
                    if (mysqli_stmt_execute($insertStmt)) {

                        // if (mysqli_stmt_execute($insertStmt)) {

    // الحصول على user_id الذي تم إنشاؤه
                        $userId = mysqli_insert_id($conn);

                        // إضافة Profile للمستخدم
                        $profileSql = "INSERT INTO profiles (user_id, username, gender, phone)
                                    VALUES (?, ?, ?, ?)";

                        $profileStmt = mysqli_prepare($conn, $profileSql);

                        mysqli_stmt_bind_param(
                            $profileStmt,
                            "isss",
                            $userId,
                            $username,
                            $gender,
                            $phone
                        );

                        mysqli_stmt_execute($profileStmt);
                        mysqli_stmt_close($profileStmt);

                        mysqli_stmt_close($insertStmt);
                        mysqli_close($conn);

                        header("Location: ../login.html");
                        exit();}

}


//                     $userId = mysqli_insert_id($conn);

// $profileSql = "INSERT INTO profiles (user_id, username, email, phone, gender)
//                VALUES (?, ?, ?, ?, ?)";

// $profileStmt = mysqli_prepare($conn, $profileSql);

// mysqli_stmt_bind_param(
//     $profileStmt,
//     "issss",
//     $userId,
//     $username,
//     $email,
//     $phone,
//     $gender
// );

// mysqli_stmt_execute($profileStmt);
// mysqli_stmt_close($profileStmt);


// mysqli_stmt_close($insertStmt);
// mysqli_close($conn);
// header("Location: ../login.html");
// exit();




                        mysqli_stmt_close($insertStmt);
                        mysqli_close($conn);
                        header("Location: ../login.html");
                        exit();
                    }
                    $errorMsg[] = "Registration failed: " . mysqli_stmt_error($insertStmt);
                    mysqli_stmt_close($insertStmt);
                }
                // else {
                //     $errorMsg[] = "Registration failed: " . mysqli_error($conn);
                // }
            }
        
    
    


$check = mysqli_prepare(
    $conn,
    "SELECT id FROM users WHERE user_email=? OR username=?"
);

mysqli_stmt_bind_param($check, "ss", $email, $username);
mysqli_stmt_execute($check);
mysqli_stmt_store_result($check);

if (mysqli_stmt_num_rows($check) > 0) {
    die("Username or Email already exists.");
}

mysqli_stmt_close($check);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users
(username, phone, gender, user_email, user_password)
VALUES
(?,?,?,?,?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssss",
    $username,
    $phone,
    $gender,
    $email,
    $hashedPassword
);





$stmt = $conn->prepare("
INSERT INTO users
(username, email, user_password, gender)
VALUES (?, ?, ?, ?)
");



$stmt->bind_param(
    "ssss",
    $username,
    $email,
    $hashedPassword,
    $gender
);

if (mysqli_stmt_execute($stmt)) {

    $_SESSION["username"] = $username;

    header("Location: ./login.html");
    exit();

} else {

    die("Registration failed.");

}

mysqli_stmt_close($stmt);
mysqli_close($conn);