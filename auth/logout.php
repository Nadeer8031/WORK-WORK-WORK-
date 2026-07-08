<?php

session_start();
header('Content-Type: application/json');

// Clear all session data
$_SESSION = array();

// Destroy the session cookie itself, if one is set
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

echo json_encode(['success' => true]);
exit();

?>
