<?php
require_once __DIR__ . '/../api/config.php';

$flash = '';
$flashType = '';

// ── POST: aanmaken / bewerken / verwijderen ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $actie = $_POST['actie'] ?? '';

    if ($actie === 'aanmaken') {
        $stmt = $pdo->prepare("
            INSERT INTO artiesten (artiest, type_act, beschrijving_nl, beschrijving_en, foto, video)
            VALUES (:artiest, :type_act, :nl, :en, :foto, :video)
        ");
        $stmt->execute([
            ':artiest'  => trim($_POST['artiest']),
            ':type_act' => trim($_POST['type_act']),
            ':nl'       => trim($_POST['beschrijving_nl']),
            ':en'       => trim($_POST['beschrijving_en']),
            ':foto'     => trim($_POST['foto']),
            ':video'    => trim($_POST['video']),
        ]);
        header('Location: artiesten.php?flash=aangemaakt');
        exit;
    }

    if ($actie === 'bijwerken') {
        $stmt = $pdo->prepare("
            UPDATE artiesten
            SET artiest=:artiest, type_act=:type_act,
                beschrijving_nl=:nl, beschrijving_en=:en,
                foto=:foto, video=:video
            WHERE id=:id
        ");
        $stmt->execute([
            ':artiest'  => trim($_POST['artiest']),
            ':type_act' => trim($_POST['type_act']),
            ':nl'       => trim($_POST['beschrijving_nl']),
            ':en'       => trim($_POST['beschrijving_en']),
            ':foto'     => trim($_POST['foto']),
            ':video'    => trim($_POST['video']),
            ':id'       => (int)$_POST['id'],
        ]);
        header('Location: artiesten.php?flash=bijgewerkt');
        exit;
    }

    if ($actie === 'verwijderen') {
        try {
            $stmt = $pdo->prepare("DELETE FROM artiesten WHERE id=:id");
            $stmt->execute([':id' => (int)$_POST['id']]);
            header('Location: artiesten.php?flash=verwijderd');
        } catch (\PDOException $e) {
            header('Location: artiesten.php?flash=fout_schema');
        }
        exit;
    }
}

// ── GET: actie bepalen ─────────────────────────────────────────────────────
$actie  = $_GET['actie'] ?? 'lijst';
$id     = (int)($_GET['id'] ?? 0);
$bewerk = null;

if ($actie === 'bewerk' && $id) {
    $stmt = $pdo->prepare("SELECT * FROM artiesten WHERE id=:id");
    $stmt->execute([':id' => $id]);
    $bewerk = $stmt->fetch();
    if (!$bewerk) { header('Location: artiesten.php'); exit; }
}

$artiesten = $pdo->query("SELECT * FROM artiesten ORDER BY id")->fetchAll();

// Flash
$flashBerichten = [
    'aangemaakt'   => ['Artiest aangemaakt!',                               'success'],
    'bijgewerkt'   => ['Artiest bijgewerkt!',                               'success'],
    'verwijderd'   => ['Artiest verwijderd!',                               'success'],
    'fout_schema'  => ['Kan niet verwijderen: artiest staat in het schema.', 'error'],
];
if (isset($_GET['flash'], $flashBerichten[$_GET['flash']])) {
    [$flash, $flashType] = $flashBerichten[$_GET['flash']];
}

function e(string $v): string { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }
function val(?array $row, string $k): string { return e($row[$k] ?? ''); }
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Artiesten — ❤U Festival Admin</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="nav">
  <a href="index.php" class="nav-brand">❤<span>U</span> Admin</a>
  <a href="index.php">Dashboard</a>
  <a href="artiesten.php" class="active">Artiesten</a>
  <a href="tijden.php">Schema</a>
  <a href="info.php">Festival info</a>
</nav>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">Artiesten</h1>
    <?php if ($actie === 'lijst'): ?>
      <a href="?actie=nieuw" class="btn btn-primary">+ Artiest toevoegen</a>
    <?php endif; ?>
  </div>

  <?php if ($flash): ?>
    <div class="alert alert-<?= $flashType ?>"><?= e($flash) ?></div>
  <?php endif; ?>

  <?php if ($actie === 'nieuw' || $actie === 'bewerk'): ?>
  <div class="card">
    <div class="card-title">
      <?= $bewerk ? 'Artiest bewerken — ' . e($bewerk['artiest']) : 'Nieuwe artiest toevoegen' ?>
    </div>
    <form method="POST" action="artiesten.php">
      <input type="hidden" name="actie" value="<?= $bewerk ? 'bijwerken' : 'aanmaken' ?>">
      <?php if ($bewerk): ?>
        <input type="hidden" name="id" value="<?= $bewerk['id'] ?>">
      <?php endif; ?>

      <div class="form-grid">
        <div class="field">
          <label>Naam *</label>
          <input type="text" name="artiest" required value="<?= val($bewerk, 'artiest') ?>" placeholder="bijv. Armin van Buuren">
        </div>
        <div class="field">
          <label>Type / rol</label>
          <input type="text" name="type_act" value="<?= val($bewerk, 'type_act') ?>" placeholder="bijv. trance icon">
        </div>
        <div class="field">
          <label>Foto (bestandsnaam)</label>
          <input type="text" name="foto" value="<?= val($bewerk, 'foto') ?>" placeholder="Artiest_Naam.webp">
        </div>
        <div class="field">
          <label>YouTube-link</label>
          <input type="url" name="video" value="<?= val($bewerk, 'video') ?>" placeholder="https://www.youtube.com/watch?v=...">
        </div>
        <div class="field full">
          <label>Beschrijving NL</label>
          <textarea name="beschrijving_nl" rows="4"><?= val($bewerk, 'beschrijving_nl') ?></textarea>
        </div>
        <div class="field full">
          <label>Beschrijving EN <span style="font-weight:400;color:var(--muted)">(leeg = NL wordt gebruikt)</span></label>
          <textarea name="beschrijving_en" rows="4"><?= val($bewerk, 'beschrijving_en') ?></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary"><?= $bewerk ? 'Opslaan' : 'Artiest aanmaken' ?></button>
        <a href="artiesten.php" class="btn btn-secondary">Annuleren</a>
      </div>
    </form>
  </div>
  <?php endif; ?>

  <div class="card">
    <?php if (empty($artiesten)): ?>
      <div class="empty">Nog geen artiesten. Voeg er een toe via de knop hierboven.</div>
    <?php else: ?>
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>Naam</th>
            <th>Type / rol</th>
            <th>Foto</th>
            <th style="width:140px">Acties</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($artiesten as $a): ?>
          <tr>
            <td style="color:var(--muted);font-size:12px"><?= $a['id'] ?></td>
            <td><strong><?= e($a['artiest']) ?></strong></td>
            <td style="color:var(--muted)"><?= e($a['type_act']) ?></td>
            <td style="color:var(--muted);font-size:12px"><?= e($a['foto']) ?: '—' ?></td>
            <td>
              <a href="?actie=bewerk&id=<?= $a['id'] ?>" class="btn btn-secondary btn-sm">Bewerk</a>
              <form method="POST" style="display:inline"
                    onsubmit="return confirm('<?= e($a['artiest']) ?> verwijderen?')">
                <input type="hidden" name="actie" value="verwijderen">
                <input type="hidden" name="id"    value="<?= $a['id'] ?>">
                <button type="submit" class="btn btn-danger btn-sm">Verwijder</button>
              </form>
            </td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

</body>
</html>
