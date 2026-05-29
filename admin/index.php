<?php
require_once __DIR__ . '/../api/config.php';

$aantalArtiesten  = $pdo->query("SELECT COUNT(*) FROM artiesten")->fetchColumn();
$aantalZat        = $pdo->query("SELECT COUNT(*) FROM tijden WHERE dag = '2026-09-05'")->fetchColumn();
$aantalZon        = $pdo->query("SELECT COUNT(*) FROM tijden WHERE dag = '2026-09-06'")->fetchColumn();
$aantalInfo       = $pdo->query("SELECT COUNT(*) FROM info")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard — ❤U Festival Admin</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="nav">
  <a href="index.php" class="nav-brand">❤<span>U</span> Admin</a>
  <a href="index.php" class="active">Dashboard</a>
  <a href="artiesten.php">Artiesten</a>
  <a href="tijden.php">Schema</a>
  <a href="info.php">Festival info</a>
</nav>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">Dashboard</h1>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-number"><?= $aantalArtiesten ?></div>
      <div class="stat-label">Artiesten</div>
    </div>
    <div class="stat-card">
      <div class="stat-number"><?= $aantalZat ?></div>
      <div class="stat-label">Optredens zaterdag</div>
    </div>
    <div class="stat-card">
      <div class="stat-number"><?= $aantalZon ?></div>
      <div class="stat-label">Optredens zondag</div>
    </div>
    <div class="stat-card">
      <div class="stat-number"><?= $aantalInfo ?></div>
      <div class="stat-label">Info-items</div>
    </div>
  </div>

  <div class="card">
    <table>
      <thead>
        <tr>
          <th>Sectie</th>
          <th>Beschrijving</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Artiesten</strong></td>
          <td style="color:var(--muted)">Artiestenprofielen, beschrijvingen, foto's en video's</td>
          <td><a href="artiesten.php" class="btn btn-secondary btn-sm">Beheren</a></td>
        </tr>
        <tr>
          <td><strong>Schema</strong></td>
          <td style="color:var(--muted)">Tijdslots, stages en dagindeling (zaterdag & zondag)</td>
          <td><a href="tijden.php" class="btn btn-secondary btn-sm">Beheren</a></td>
        </tr>
        <tr>
          <td><strong>Festival info</strong></td>
          <td style="color:var(--muted)">Bereikbaarheid, lockers, FAQ en Golden-GLU</td>
          <td><a href="info.php" class="btn btn-secondary btn-sm">Beheren</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</body>
</html>
