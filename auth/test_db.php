<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>DB Diagnostic</h2>";

// Test 1: Can we find db.php?
$db_path = __DIR__ . '/../config/db.php';
echo "<p>db.php path: <code>$db_path</code></p>";
echo "<p>db.php exists: " . (file_exists($db_path) ? '<b style="color:green">YES</b>' : '<b style="color:red">NO</b>') . "</p>";

// Test 2: Include it
if (file_exists($db_path)) {
    require_once $db_path;
    echo "<p>Connection object: " . ($conn ? '<b style="color:green">OK</b>' : '<b style="color:red">FAILED - ' . mysqli_connect_error() . '</b>') . "</p>";
} else {
    echo "<p style='color:red'>Cannot include db.php — path is wrong!</p>";
}

// Test 3: Show users table
if (!empty($conn)) {
    $res = mysqli_query($conn, "SHOW COLUMNS FROM users");
    echo "<h3>users table columns:</h3><ul>";
    while ($row = mysqli_fetch_assoc($res)) {
        echo "<li>" . $row['Field'] . " (" . $row['Type'] . ")</li>";
    }
    echo "</ul>";
}

// Test 4: Check POST
echo "<h3>POST data received:</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";
?>
