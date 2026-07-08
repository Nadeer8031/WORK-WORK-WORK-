<?php
// Application entry point. Sends visitors to the right place depending on
// whether they already have a logged-in session.

session_start();

if (isset($_SESSION['user_id'])) {
    header("Location: pages/dashboard.php");
} else {
    header("Location: home.html");
}
exit();
?>
