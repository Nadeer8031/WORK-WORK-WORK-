<?php
// Shared header/nav for server-rendered pages (pages/dashboard.php, pages/profile.php, etc.)
// Expects to be included from a file living one folder below the project root,
// e.g. include '../includes/header.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$isLoggedIn = isset($_SESSION['user_id']);
$pageTitle = isset($pageTitle) ? $pageTitle : 'AuraMed Smart Systems';
?>
<!doctype html>
<html class="light" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  </head>
  <body class="bg-surface font-body-md text-on-surface min-h-screen flex flex-col relative overflow-hidden">
    <header class="fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-sm border-b border-secondary-container">
      <div class="max-w-container-max mx-auto h-20 px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-4">
        <a class="shrink-0 flex items-center" href="../home.html" aria-label="AuraMed Home">
          <img src="../assets/logo.svg" alt="AuraMed" class="h-10 w-auto" />
        </a>
        <nav class="hidden md:flex items-center gap-8">
          <a class="text-secondary hover:text-primary transition-colors duration-250 pb-1 border-b-2 border-transparent font-label-md text-label-md" href="../home.html">Home</a>
          <a class="text-secondary hover:text-primary transition-colors duration-250 pb-1 border-b-2 border-transparent font-label-md text-label-md" href="../products.html">Products &amp; Bundles</a>
          <a class="text-secondary hover:text-primary transition-colors duration-250 pb-1 border-b-2 border-transparent font-label-md text-label-md" href="../schedule.html">Schedule</a>
          <a class="text-secondary hover:text-primary transition-colors duration-250 pb-1 border-b-2 border-transparent font-label-md text-label-md" href="profile.php">Profile</a>
        </nav>
        <div class="flex items-center gap-4 md:gap-5">
          <a aria-label="View cart" class="text-on-surface-variant hover:text-primary transition-colors duration-250" href="../cart.html">
            <span class="material-symbols-outlined">shopping_cart</span>
          </a>
          <?php if ($isLoggedIn): ?>
            <a class="hidden md:inline-block font-label-md text-label-md text-secondary hover:text-primary transition-colors duration-250" href="../auth/logout.php">Log Out</a>
          <?php else: ?>
            <a class="hidden md:inline-block font-label-md text-label-md text-secondary hover:text-primary transition-colors duration-250" href="../login.html">Log In</a>
            <a class="hidden md:inline-flex items-center justify-center bg-primary-container text-white px-5 h-10 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-250" href="../signup.html">Sign Up</a>
          <?php endif; ?>
        </div>
      </div>
    </header>
    <main class="flex-grow relative z-10 px-margin-mobile md:px-margin-desktop py-12 pt-32">
