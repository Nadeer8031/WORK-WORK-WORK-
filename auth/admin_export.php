<?php
session_start();
include __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_id'])) {
    http_response_code(403);
    exit('Not authenticated.');
}

$section = $_GET['section'] ?? 'users';
$filename = 'pillpal_' . $section . '_' . date('Y-m-d') . '.csv';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');

// Runs a query that returns a single value (e.g. a COUNT(*) or SUM(...)).
// If the query fails for any reason (missing column/table on older
// installs, etc.) this returns $default instead of crashing the whole
// export the way a raw mysqli_fetch_row(mysqli_query(...)) would.
function scalarQuery($conn, $sql, $default = 0) {
    $result = mysqli_query($conn, $sql);
    if ($result === false) {
        return $default;
    }
    $row = mysqli_fetch_row($result);
    return $row ? $row[0] : $default;
}

if ($section === 'users') {
    fputcsv($output, ['ID', 'Username', 'Email', 'Gender', 'Phone', 'Joined']);

    // Some installs' `users` table predates the `created_at` column (same
    // situation as the `price` column on `products`). Try the full query
    // first, and fall back to one without it instead of crashing if that
    // column doesn't exist yet.
    $sql = "SELECT user_id, username, user_email, gender, phone, created_at FROM users ORDER BY user_id";
    $result = mysqli_query($conn, $sql);
    $hasCreatedAt = true;
    if ($result === false) {
        $hasCreatedAt = false;
        $sql = "SELECT user_id, username, user_email, gender, phone FROM users ORDER BY user_id";
        $result = mysqli_query($conn, $sql);
    }

    if ($result === false) {
        fputcsv($output, ['Error', 'Could not read users table: ' . mysqli_error($conn)]);
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            fputcsv($output, [
                $row['user_id'],
                $row['username'],
                $row['user_email'],
                $row['gender'] ?? '',
                $row['phone'] ?? '',
                $hasCreatedAt ? $row['created_at'] : ''
            ]);
        }
    }
} elseif ($section === 'products') {
    fputcsv($output, ['ID', 'Name', 'Price', 'Stock Quantity', 'Added']);
    $sql = "SELECT product_id, product_name, price, stock_quantity, created_at FROM products ORDER BY product_id";
    $result = mysqli_query($conn, $sql);
    if ($result === false) {
        fputcsv($output, ['Error', 'Could not read products table: ' . mysqli_error($conn)]);
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            fputcsv($output, [
                $row['product_id'],
                $row['product_name'],
                number_format((float)($row['price'] ?? 0), 2, '.', ''),
                $row['stock_quantity'],
                $row['created_at'] ?? ''
            ]);
        }
    }
} elseif ($section === 'bundles') {
    fputcsv($output, ['ID', 'Name', 'Price', 'Stock Quantity', 'Added']);
    $sql = "SELECT bundle_id, bundle_name, bundle_price, stock_quantity, created_at FROM bundles ORDER BY bundle_id";
    $result = mysqli_query($conn, $sql);
    if ($result === false) {
        fputcsv($output, ['Error', 'Could not read bundles table: ' . mysqli_error($conn)]);
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            fputcsv($output, [
                $row['bundle_id'],
                $row['bundle_name'],
                number_format((float)($row['bundle_price'] ?? 0), 2, '.', ''),
                $row['stock_quantity'],
                $row['created_at'] ?? ''
            ]);
        }
    }
} elseif ($section === 'orders') {
    fputcsv($output, ['Order ID', 'User ID', 'Quantity', 'Total', 'Date']);
    $sql = "SELECT order_id, user_id, order_quantity, order_price, created_at FROM orders ORDER BY order_id";
    $result = mysqli_query($conn, $sql);
    if ($result === false) {
        fputcsv($output, ['Error', 'Could not read orders table: ' . mysqli_error($conn)]);
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            fputcsv($output, [
                $row['order_id'],
                $row['user_id'],
                $row['order_quantity'],
                $row['order_price'],
                $row['created_at']
            ]);
        }
    }
} elseif ($section === 'overview') {
    // Summary stats pulled live from the database — the same numbers the
    // Overview cards are meant to represent, exported as a simple report.
    // Every value goes through scalarQuery() so a missing column/table on
    // an older install just yields 0 for that row instead of crashing the
    // whole export.
    fputcsv($output, ['Metric', 'Value']);
    fputcsv($output, ['Report generated', date('Y-m-d H:i:s')]);
    fputcsv($output, []);

    $totalUsers = (int) scalarQuery($conn, "SELECT COUNT(*) FROM users");
    fputcsv($output, ['Total Users', $totalUsers]);

    $totalProducts = (int) scalarQuery($conn, "SELECT COUNT(*) FROM products");
    fputcsv($output, ['Total Products', $totalProducts]);

    $totalStock = (int) scalarQuery($conn, "SELECT COALESCE(SUM(stock_quantity), 0) FROM products");
    fputcsv($output, ['Total Units In Stock', $totalStock]);

    $lowStock = (int) scalarQuery($conn, "SELECT COUNT(*) FROM products WHERE stock_quantity <= 5");
    fputcsv($output, ['Products Low/Out of Stock (<=5 units)', $lowStock]);

    $totalOrders = (int) scalarQuery($conn, "SELECT COUNT(*) FROM orders");
    fputcsv($output, ['Total Orders', $totalOrders]);

    $totalRevenue = (float) scalarQuery($conn, "SELECT COALESCE(SUM(order_price), 0) FROM orders");
    fputcsv($output, ['Total Revenue', number_format($totalRevenue, 2, '.', '')]);

    $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
    fputcsv($output, ['Average Order Value', number_format($avgOrderValue, 2, '.', '')]);

    $totalSchedules = (int) scalarQuery($conn, "SELECT COUNT(*) FROM schedules");
    fputcsv($output, ['Active Medication Schedules', $totalSchedules]);

    // These two rely on created_at columns that may not exist on every
    // install (see the users-table note above) — scalarQuery() just
    // reports 0 rather than crashing if so.
    $newUsers7d = (int) scalarQuery($conn, "SELECT COUNT(*) FROM users WHERE created_at >= (NOW() - INTERVAL 7 DAY)");
    fputcsv($output, ['New Users (Last 7 Days)', $newUsers7d]);

    $ordersLast7d = (int) scalarQuery($conn, "SELECT COUNT(*) FROM orders WHERE created_at >= (NOW() - INTERVAL 7 DAY)");
    fputcsv($output, ['Orders (Last 7 Days)', $ordersLast7d]);
}

fclose($output);
mysqli_close($conn);
exit();
