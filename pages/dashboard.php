<?php
session_start();

// Protect this page: bounce anonymous visitors to login
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html?error=login_required");
    exit();
}

include '../config/db.php';

$userId = $_SESSION['user_id'];

$stmt = mysqli_prepare($conn, "SELECT u_id, u_email FROM users WHERE u_id = ?");
mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);
mysqli_close($conn);

$pageTitle = 'Dashboard | AuraMed Smart Systems';
include '../includes/header.php';
?>

<div class="max-w-container-max mx-auto">
  <h1 class="font-headline-md text-headline-md text-on-surface mb-4">
    Welcome back<?php echo $user ? ', ' . htmlspecialchars($user['u_email']) : ''; ?>
  </h1>
  <p class="font-body-md text-secondary mb-8">
    This is your dashboard. Recent orders, refill reminders, and account
    shortcuts can be built out here.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <a href="profile.php" class="login-card rounded-2xl p-6 ambient-shadow hover:opacity-90 transition-all">
      <h2 class="font-label-md text-label-md text-on-surface mb-1">My Profile</h2>
      <p class="font-body-md text-secondary text-sm">View and edit your account details</p>
    </a>
    <a href="../schedule.html" class="login-card rounded-2xl p-6 ambient-shadow hover:opacity-90 transition-all">
      <h2 class="font-label-md text-label-md text-on-surface mb-1">Schedule</h2>
      <p class="font-body-md text-secondary text-sm">Manage your upcoming refills</p>
    </a>
    <a href="../products.html" class="login-card rounded-2xl p-6 ambient-shadow hover:opacity-90 transition-all">
      <h2 class="font-label-md text-label-md text-on-surface mb-1">Products &amp; Bundles</h2>
      <p class="font-body-md text-secondary text-sm">Browse and reorder supplies</p>
    </a>
  </div>
</div>

<?php include '../includes/footer.php'; ?>
