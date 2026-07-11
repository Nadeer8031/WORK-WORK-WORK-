<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Admin: list all users with profile data
    $sql = "SELECT u.user_id, u.user_email, u.username, u.gender, u.phone,
                   p.username AS profile_username, p.phone AS profile_phone, p.gender AS profile_gender
            FROM users u
            LEFT JOIN profiles p ON u.user_id = p.user_id
            ORDER BY u.user_id DESC";
    $result = mysqli_query($conn, $sql);
    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = [
            'id'       => (int)$row['user_id'],
            'username' => $row['profile_username'] ?: $row['username'],
            'email'    => $row['user_email'],
            'gender'   => $row['profile_gender'] ?: $row['gender'] ?: '',
            'phone'    => $row['profile_phone'] ?: (string)($row['phone'] ?? ''),
        ];
    }
    echo json_encode(['success' => true, 'users' => $users]);

} elseif ($method === 'POST') {
    // Admin: add user
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $gender   = $_POST['gender'] ?? 'male';
    $phone    = (int)($_POST['phone'] ?? 0);
    $password = $_POST['password'] ?? 'Default1';

    if (empty($username) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Username and email are required.']);
        exit();
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = mysqli_prepare($conn, "INSERT INTO users (username, user_email, user_password, gender, phone) VALUES (?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, 'ssssi', $username, $email, $hash, $gender, $phone);

    if (mysqli_stmt_execute($stmt)) {
        $userId = mysqli_insert_id($conn);
        $pStmt = mysqli_prepare($conn, "INSERT INTO profiles (user_id, username, gender, phone) VALUES (?, ?, ?, ?)");
        $phoneStr = (string)$phone;
        mysqli_stmt_bind_param($pStmt, 'isss', $userId, $username, $gender, $phoneStr);
        mysqli_stmt_execute($pStmt);
        mysqli_stmt_close($pStmt);

        echo json_encode(['success' => true, 'user_id' => $userId, 'message' => 'User added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add user.']);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'PUT') {
    // Admin: update user
    parse_str(file_get_contents('php://input'), $data);
    $id       = (int)($data['id'] ?? 0);
    $username = trim($data['username'] ?? '');
    $email    = trim($data['email'] ?? '');
    $gender   = $data['gender'] ?? 'male';
    $phone    = (int)($data['phone'] ?? 0);

    if ($id <= 0 || empty($username) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "UPDATE users SET username = ?, user_email = ?, gender = ?, phone = ? WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, 'sssii', $username, $email, $gender, $phone, $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $phoneStr = (string)$phone;
    $pStmt = mysqli_prepare($conn, "UPDATE profiles SET username = ?, gender = ?, phone = ? WHERE user_id = ?");
    mysqli_stmt_bind_param($pStmt, 'sssi', $username, $gender, $phoneStr, $id);
    mysqli_stmt_execute($pStmt);
    mysqli_stmt_close($pStmt);

    echo json_encode(['success' => true, 'message' => 'User updated.']);

} elseif ($method === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $id = (int)($data['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM users WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'User deleted.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user.']);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
