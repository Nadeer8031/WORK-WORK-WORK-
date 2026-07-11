<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Public: list all bundles (for admin dashboard)
    $result = mysqli_query($conn, "SELECT * FROM bundles ORDER BY bundle_id DESC");
    $bundles = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $bundles[] = [
            'bundle_id'      => (int)$row['bundle_id'],
            'bundle_name'    => $row['bundle_name'],
            'bundle_price'   => (float)($row['bundle_price'] ?? 0),
            'stock_quantity' => (int)($row['stock_quantity'] ?? 0),
            'created_at'     => $row['created_at'] ?? null,
        ];
    }
    echo json_encode(['success' => true, 'bundles' => $bundles]);

} elseif ($method === 'POST') {
    // Admin: add bundle
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    $name = trim($_POST['bundle_name'] ?? '');
    $price = (float)($_POST['bundle_price'] ?? 0);
    $stock = (int)($_POST['stock_quantity'] ?? 0);

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Bundle name is required.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "INSERT INTO bundles (bundle_name, bundle_price, stock_quantity) VALUES (?, ?, ?)");

    if (!$stmt) {
        // Most common cause: the `bundles` table on this database doesn't have
        // a `stock_quantity` column yet (older schema). Run the ALTER TABLE in
        // the docs to add it, then try again.
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . mysqli_error($conn) . '. If this mentions an unknown column "stock_quantity" or "bundle_price", your bundles table needs to be updated — see config/schema.sql.',
        ]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'sdi', $name, $price, $stock);

    if (mysqli_stmt_execute($stmt)) {
        $id = mysqli_insert_id($conn);
        echo json_encode(['success' => true, 'bundle_id' => $id, 'message' => 'Bundle added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add bundle: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'PUT') {
    // Admin: update bundle
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    parse_str(file_get_contents('php://input'), $data);
    $id    = (int)($data['bundle_id'] ?? 0);
    $name  = trim($data['bundle_name'] ?? '');
    $price = (float)($data['bundle_price'] ?? 0);
    $stock = (int)($data['stock_quantity'] ?? 0);

    if ($id <= 0 || empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "UPDATE bundles SET bundle_name = ?, bundle_price = ?, stock_quantity = ? WHERE bundle_id = ?");

    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . mysqli_error($conn) . '. If this mentions an unknown column "stock_quantity" or "bundle_price", your bundles table needs to be updated — see config/schema.sql.',
        ]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'sdii', $name, $price, $stock, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Bundle updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update bundle: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'DELETE') {
    // Admin: delete bundle
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    parse_str(file_get_contents('php://input'), $data);
    $id = (int)($data['bundle_id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid bundle ID.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM bundles WHERE bundle_id = ?");

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'i', $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Bundle deleted.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete bundle: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
