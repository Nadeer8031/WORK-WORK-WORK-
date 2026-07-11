<?php

// PHP 8.1+ made mysqli throw exceptions on query/prepare errors by default.
// This codebase is written the "classic" way — checking `if (!$stmt)` /
// `if (!$conn)` after each call — so we turn that back off here. Without
// this, a bad query (e.g. a missing column) causes an uncaught fatal error
// instead of the graceful JSON error message the endpoints were designed
// to return.
mysqli_report(MYSQLI_REPORT_OFF);

$host = "localhost"; 
$username = "root";
$password = "";
$database = "conference";

$conn = mysqli_connect(
    $host,
    $username,
    $password,
    $database
);

if (!$conn){
    die("Connection Failed : "
        . mysqli_connect_error());
}

?>