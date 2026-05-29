<?php
require_once __DIR__ . '/../api/config.php';

$flash = '';
$flashType = '';

// ── POST handlers ──────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $actie = $_POST['actie'] ?? '';

    if ($actie === 'aanmaken') {
        $stmt = $pdo->prepare("
            INSERT INTO info (title, title_en, sub_title, sub_title_en, bericht, bericht_en)
            VALUES (:title, :title_en, :sub, :sub_en, :bericht, :bericht_en)
        ");
        $stmt->execute([
            ':title'     => trim($_POST['title']),
            ':title_en'  => trim($_POST['title_en']),
            ':sub'       => trim($_POST['sub_title']),
            ':sub_en'    => trim($_POST['sub_title_en']),
            ':bericht'   => trim($_POST['bericht']),
            ':bericht_en'=> trim($_POST['bericht_en']),
        ]);
        header('Location: info.php?flash=aangemaakt');
        exit;
    }

    if ($actie === 'bijwerken') {
        $stmt = $pdo->prepare("
            UPDATE info
            SET title=:title, title_en=:title_en,
                sub_title=:sub, sub_title_en=:sub_en,
                bericht=:bericht, bericht_en=:bericht_en
            WHERE id=:id
        ");
        $stmt->execute([
            ':title'     => trim($_POST['title']),
            ':title_en'  => trim($_POST['title_en']),
            ':sub'       => trim($_POST['sub_title']),
            ':sub_en'    => trim($_POST['sub_title_en']),
            ':bericht'   => trim($_POST['bericht']),
            ':bericht_en'=> trim($_POST['bericht_en']),
            ':id'        => (int)$_POST['id'],
        ]);
        header('Location: info.php?flash=bijgewerkt');
        exit;
    }

    if ($actie === 'verwijderen') {
        $stmt = $pdo->prepare("DELETE FROM info WHERE id=:id");
        $stmt->execute([':id' => (int)$_POST['id']]);
        header('Location: info.php?flash=verwijderd');
        exit;
    }
}

// ── GET ────────────────────────────────────────────────────────────────────
$actie  = $_GET['actie'] ?? 'lijst';
$id     = (int)($_GET['id'] ?? 0);
$bewerk = null;

if ($actie === 'bewerk' && $id) {
    $stmt = $pdo->prepare("SELECT * FROM info WHERE id=:id");
    $stmt->execute([':id' => $id]);
    $bewerk = $stmt->fetch();
    if (!$bewerk) { header('Location: info.php'); exit; }
}

$infoItems = $pdo->query("SELECT * FROM info ORDER BY title, id")->fetchAll();

// Unieke sectietitels voor het formulier
$secties = $pdo->query("SELECT DISTINCT title FROM info ORDER BY title")->fetchAll(PDO::FETCH_COLUMN);

$flashBerichten = [
    'aangemaakt' => ['Info-item aangemaakt!', 'success'],
    'bijgewerkt' => ['Info-item bijgewerkt!', 'success'],
    'verwijderd' => ['Info-item verwijderd!', 'success'],
];
if (isset($_GET['flash'], $flashBerichten[$_GET['flash']])) {
    [$flash, $flashType] = $flashBerichten[$_GET['flash']];
}

function e(string $v): string { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }
function val(?array $row, string $k): string { return e($row[$k] ?? ''); }

// Groepeer per sectie voor de tabel
$gegroepeerd = [];
foreach ($infoItems as $item) {
    $gegroepeerd[$item['title']][] = $item;
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Festival info — ❤U Festival Admin</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="nav">
  <a href="index.php" class="nav-brand">❤<span>U</span> Admin</a>
  <a href="index.php">Dashboard</a>
  <a href="artiesten.php">Artiesten</a>
  <a href="tijden.php">Schema</a>
  <a href="info.php" class="active">Festival info</a>
</nav>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">Festival info</h1>
    <?php if ($actie === 'lijst'): ?>
      <a href="?actie=nieuw" class="btn btn-primary">+ Item toevoegen</a>
    <?php endif; ?>
  </div>

  <?php if ($flash): ?>
    <div class="alert alert-<?= $flashType ?>"><?= e($flash) ?></div>
  <?php endif; ?>

  <?php if ($actie === 'nieuw' || $actie === 'bewerk'): ?>
  <div class="card">
    <div class="card-title">
      <?= $bewerk ? 'Info-item bewerken' : 'Nieuw info-item toevoegen' ?>
    </div>
    <form method="POST" action="info.php">
      <input type="hidden" name="actie" value="<?= $bewerk ? 'bijwerken' : 'aanmaken' ?>">
      <?php if ($bewerk): ?>
        <input type="hidden" name="id" value="<?= $bewerk['id'] ?>">
      <?php endif; ?>

      <div class="form-grid">
        <!-- Sectietitel -->
        <div class="field">
          <label>Sectie (NL) *</label>
          <input type="text" name="title" list="sectie-lijst" required
                 value="<?= val($bewerk, 'title') ?>"
                 placeholder="bijv. Bereikbaarheid">
          <datalist id="sectie-lijst">
            <?php foreach ($secties as $s): ?>
              <option value="<?= e($s) ?>">
            <?php endforeach; ?>
          </datalist>
        </div>
        <div class="field">
          <label>Sectie (EN) <span style="font-weight:400;color:var(--muted)">(leeg = NL)</span></label>
          <input type="text" name="title_en"
                 value="<?= val($bewerk, 'title_en') ?>"
                 placeholder="bijv. Accessibility">
        </div>

        <!-- Subtitel -->
        <div class="field">
          <label>Subtitel / vraag (NL)</label>
          <input type="text" name="sub_title"
                 value="<?= val($bewerk, 'sub_title') ?>"
                 placeholder="bijv. Fiets">
        </div>
        <div class="field">
          <label>Subtitel / vraag (EN) <span style="font-weight:400;color:var(--muted)">(leeg = NL)</span></label>
          <input type="text" name="sub_title_en"
                 value="<?= val($bewerk, 'sub_title_en') ?>"
                 placeholder="bijv. Bicycle">
        </div>

        <!-- Bericht -->
        <div class="field full">
          <label>Bericht / antwoord (NL) *</label>
          <textarea name="bericht" rows="5" required><?= val($bewerk, 'bericht') ?></textarea>
        </div>
        <div class="field full">
          <label>Bericht / antwoord (EN) <span style="font-weight:400;color:var(--muted)">(leeg = NL wordt gebruikt)</span></label>
          <textarea name="bericht_en" rows="5"><?= val($bewerk, 'bericht_en') ?></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary"><?= $bewerk ? 'Opslaan' : 'Item aanmaken' ?></button>
        <a href="info.php" class="btn btn-secondary">Annuleren</a>
      </div>
    </form>
  </div>
  <?php endif; ?>

  <!-- Tabel gegroepeerd per sectie -->
  <?php foreach ($gegroepeerd as $sectie => $items): ?>
  <div class="card">
    <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
      <?= e($sectie) ?>
      <span style="font-size:12px;color:var(--muted);font-weight:400"><?= count($items) ?> item(s)</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>Subtitel</th>
          <th>Bericht (NL)</th>
          <th style="width:140px">Acties</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($items as $item): ?>
        <tr>
          <td style="color:var(--muted);font-size:12px"><?= $item['id'] ?></td>
          <td><?= $item['sub_title'] ? e($item['sub_title']) : '<span style="color:var(--muted)">—</span>' ?></td>
          <td style="color:var(--muted);font-size:13px;max-width:380px">
            <?= e(mb_substr($item['bericht'], 0, 80)) ?><?= mb_strlen($item['bericht']) > 80 ? '…' : '' ?>
          </td>
          <td>
            <a href="?actie=bewerk&id=<?= $item['id'] ?>" class="btn btn-secondary btn-sm">Bewerk</a>
            <form method="POST" style="display:inline"
                  onsubmit="return confirm('Dit info-item verwijderen?')">
              <input type="hidden" name="actie" value="verwijderen">
              <input type="hidden" name="id"    value="<?= $item['id'] ?>">
              <button type="submit" class="btn btn-danger btn-sm">Verwijder</button>
            </form>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endforeach; ?>

  <?php if (empty($infoItems)): ?>
    <div class="card"><div class="empty">Nog geen info-items.</div></div>
  <?php endif; ?>
</div>

</body>
</html>
