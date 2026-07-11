<?php
session_start();
header('Content-Type: application/json');
include __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Place an order (requires login)
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in.']);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['items']) || !is_array($input['items']) || empty($input['items'])) {
        echo json_encode(['success' => false, 'message' => 'No items in order.']);
        exit();
    }

    $userId     = (int)$_SESSION['user_id'];
    $totalPrice = 0;
    $totalQty   = 0;

    foreach ($input['items'] as $item) {
        $totalPrice += (float)($item['price'] ?? 0) * (int)($item['qty'] ?? 1);
        $totalQty   += (int)($item['qty'] ?? 1);
    }

    // Create order
    $orderStmt = mysqli_prepare($conn, "INSERT INTO orders (user_id, order_quantity, order_price) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($orderStmt, 'iid', $userId, $totalQty, $totalPrice);

    if (!mysqli_stmt_execute($orderStmt)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create order.']);
        mysqli_stmt_close($orderStmt);
        exit();
    }

    $orderId = mysqli_insert_id($conn);
    mysqli_stmt_close($orderStmt);

    // Insert order items
    $itemStmt = mysqli_prepare($conn, "INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)");
    foreach ($input['items'] as $item) {
        $productId = (int)($item['product_id'] ?? 0);
        $qty       = (int)($item['qty'] ?? 1);
        if ($productId > 0) {
            mysqli_stmt_bind_param($itemStmt, 'iii', $orderId, $productId, $qty);
            mysqli_stmt_execute($itemStmt);
        }
    }
    mysqli_stmt_close($itemStmt);

    // Create payment record
    $payStmt = mysqli_prepare($conn, "INSERT INTO payments (order_id, payment_date, amount) VALUES (?, CURDATE(), ?)");
    mysqli_stmt_bind_param($payStmt, 'id', $orderId, $totalPrice);
    mysqli_stmt_execute($payStmt);
    mysqli_stmt_close($payStmt);

    echo json_encode([
        'success'  => true,
        'order_id' => (int)$orderId,
        'message'  => 'Order placed successfully.',
    ]);

} elseif ($method === 'GET') {
    // Get orders for logged-in user (or all for admin)
    if (isset($_SESSION['admin_id'])) {
        // Admin: all orders
        $sql = "SELECT o.order_id, o.user_id, u.username, o.order_quantity, o.order_price, o.created_at
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.user_id
                ORDER BY o.created_at DESC";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } elseif (isset($_SESSION['user_id'])) {
        // User: own orders
        $userId = (int)$_SESSION['user_id'];
        $stmt = mysqli_prepare($conn, "SELECT order_id, order_quantity, order_price, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        mysqli_stmt_bind_param($stmt, 'i', $userId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } else {
        echo json_encode(['success' => false, 'message' => 'Not logged in.']);
        exit();
    }

    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $order = [
            'order_id'   => (int)$row['order_id'],
            'quantity'   => (int)$row['order_quantity'],
            'total'      => (float)$row['order_price'],
            'created_at' => $row['created_at'],
        ];
        if (isset($row['username'])) $order['username'] = $row['username'];
        if (isset($row['user_id']))  $order['user_id']  = (int)$row['user_id'];

        // Get order items
        $itemStmt2 = mysqli_prepare($conn, "SELECT op.product_id, op.quantity, p.product_name
                                            FROM order_products op
                                            LEFT JOIN products p ON op.product_id = p.product_id
                                            WHERE op.order_id = ?");
        mysqli_stmt_bind_param($itemStmt2, 'i', $row['order_id']);
        mysqli_stmt_execute($itemStmt2);
        $itemResult = mysqli_stmt_get_result($itemStmt2);
        $items = [];
        while ($itemRow = mysqli_fetch_assoc($itemResult)) {
            $items[] = [
                'product_id'   => (int)$itemRow['product_id'],
                'product_name' => $itemRow['product_name'] ?? 'Unknown',
                'quantity'     => (int)$itemRow['quantity'],
            ];
        }
        mysqli_stmt_close($itemStmt2);
        $order['items'] = $items;

        $orders[] = $order;
    }

    mysqli_stmt_close($stmt);
    echo json_encode(['success' => true, 'orders' => $orders]);
}

mysqli_close($conn);
