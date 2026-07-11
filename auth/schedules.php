<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit();
}

$userId = (int)$_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = mysqli_prepare($conn, "SELECT schedule_id, medicine_name, reminder_time, dosage FROM schedules WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $schedules = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $schedules[] = [
            'id'            => (int)$row['schedule_id'],
            'name'          => $row['medicine_name'],
            'time'          => $row['reminder_time'],
            'dose'          => $row['dosage'],
        ];
    }
    mysqli_stmt_close($stmt);
    echo json_encode(['success' => true, 'schedules' => $schedules]);

} elseif ($method === 'POST') {
    $name  = trim($_POST['medicine_name'] ?? '');
    $time  = $_POST['reminder_time'] ?? '';
    $dose  = trim($_POST['dosage'] ?? '');

    if (empty($name) || empty($time) || empty($dose)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "INSERT INTO schedules (user_id, medicine_name, reminder_time, dosage) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, 'isss', $userId, $name, $time, $dose);

    if (mysqli_stmt_execute($stmt)) {
        $id = mysqli_insert_id($conn);
        echo json_encode(['success' => true, 'schedule_id' => (int)$id, 'message' => 'Medication added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add medication.']);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $id = (int)($data['schedule_id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid schedule ID.']);
        exit();
    }

    // Ensure the schedule belongs to this user
    $stmt = mysqli_prepare($conn, "DELETE FROM schedules WHERE schedule_id = ? AND user_id = ?");
    mysqli_stmt_bind_param($stmt, 'ii', $id, $userId);

    if (mysqli_stmt_execute($stmt) && mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => true, 'message' => 'Medication removed.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Not found or already removed.']);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
