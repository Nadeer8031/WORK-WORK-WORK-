<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Public: list all products (for admin dashboard)
    $result = mysqli_query($conn, "SELECT * FROM products ORDER BY product_id DESC");
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = [
            'product_id'     => (int)$row['product_id'],
            'product_name'   => $row['product_name'],
            'price'          => (float)($row['price'] ?? 0),
            'stock_quantity' => (int)$row['stock_quantity'],
            'created_at'     => $row['created_at'],
        ];
    }
    echo json_encode(['success' => true, 'products' => $products]);

} elseif ($method === 'POST') {
    // Admin: add product
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    $name = trim($_POST['product_name'] ?? '');
    $price = (float)($_POST['price'] ?? 0);
    $stock = (int)($_POST['stock_quantity'] ?? 0);

    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Product name is required.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "INSERT INTO products (product_name, price, stock_quantity) VALUES (?, ?, ?)");

    if (!$stmt) {
        // Most common cause: the `products` table on this database doesn't have
        // a `price` column yet (older schema). Run the ALTER TABLE in the docs
        // to add it, then try again.
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . mysqli_error($conn) . '. If this mentions an unknown column "price", your products table needs to be updated — see config/schema.sql.',
        ]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'sdi', $name, $price, $stock);

    if (mysqli_stmt_execute($stmt)) {
        $id = mysqli_insert_id($conn);
        echo json_encode(['success' => true, 'product_id' => $id, 'message' => 'Product added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'PUT') {
    // Admin: update product
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    parse_str(file_get_contents('php://input'), $data);
    $id    = (int)($data['product_id'] ?? 0);
    $name  = trim($data['product_name'] ?? '');
    $price = (float)($data['price'] ?? 0);
    $stock = (int)($data['stock_quantity'] ?? 0);

    if ($id <= 0 || empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "UPDATE products SET product_name = ?, price = ?, stock_quantity = ? WHERE product_id = ?");

    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . mysqli_error($conn) . '. If this mentions an unknown column "price", your products table needs to be updated — see config/schema.sql.',
        ]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'sdii', $name, $price, $stock, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Product updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update product: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);

} elseif ($method === 'DELETE') {
    // Admin: delete product
    if (!isset($_SESSION['admin_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated as admin.']);
        exit();
    }

    parse_str(file_get_contents('php://input'), $data);
    $id = (int)($data['product_id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid product ID.']);
        exit();
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM products WHERE product_id = ?");

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
        exit();
    }

    mysqli_stmt_bind_param($stmt, 'i', $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Product deleted.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete product: ' . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
}

mysqli_close($conn);
