<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html?error=login_required");
    exit();
}

include '../config/db.php';

$userId = $_SESSION['user_id'];

$stmt = mysqli_prepare($conn, "SELECT user_id, user_email FROM users WHERE user_id = ?");
mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);
mysqli_close($conn);

$pageTitle = 'My Profile | AuraMed Smart Systems';
include '../includes/header.php';
?>

<div class="max-w-[600px] mx-auto">
  <div class="login-card w-full rounded-2xl p-8 md:p-10 ambient-shadow">
    <h1 class="font-headline-md text-headline-md text-on-surface mb-8">My Profile</h1>

    <div class="space-y-6">
      <div>
        <p class="font-label-md text-label-md text-on-surface-variant mb-1">Email Address</p>
        <p class="font-body-md text-on-surface"><?php echo $user ? htmlspecialchars($user['u_email']) : ''; ?></p>
      </div>
    </div>

    <div class="pt-8">
      <a href="../auth/logout.php"
         class="w-full block text-center bg-[#340D1A] text-white font-label-md text-label-md py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-slow">
        Log Out
      </a>
    </div>
  </div>
</div>

<?php include '../includes/footer.php'; ?>
