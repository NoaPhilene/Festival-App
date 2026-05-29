<?php
require_once __DIR__ . '/../api/config.php';

$flash = '';
$flashType = '';

// Stage-kleur voor dot
$stageDot = [
    'Ponton'   => 'ponton',
    'The_Lake' => 'lake',
    'The_Club' => 'club',
    'Hangar'   => 'hangar',
];

// ── POST handlers ──────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $actie = $_POST['actie'] ?? '';

    if ($actie === 'aanmaken') {
        $stmt = $pdo->prepare("
            INSERT INTO tijden (start_tijd, eind_tijd, dag, stage_id, artiesten_id)
            VALUES (:start, :eind, :dag, :stage, :artiest)
        ");
        $stmt->execute([
            ':start'   => $_POST['start_tijd'],
            ':eind'    => $_POST['eind_tijd'],
            ':dag'     => $_POST['dag'],
            ':stage'   => (int)$_POST['stage_id'],
            ':artiest' => (int)$_POST['artiesten_id'],
        ]);
        header('Location: tijden.php?flash=aangemaakt');
        exit;
    }

    if ($actie === 'bijwerken') {
        $stmt = $pdo->prepare("
            UPDATE tijden
            SET start_tijd=:start, eind_tijd=:eind, dag=:dag,
                stage_id=:stage, artiesten_id=:artiest
            WHERE id=:id
        ");
        $stmt->execute([
            ':start'   => $_POST['start_tijd'],
            ':eind'    => $_POST['eind_tijd'],
            ':dag'     => $_POST['dag'],
            ':stage'   => (int)$_POST['stage_id'],
            ':artiest' => (int)$_POST['artiesten_id'],
            ':id'      => (int)$_POST['id'],
        ]);
        header('Location: tijden.php?flash=bijgewerkt');
        exit;
    }

    if ($actie === 'verwijderen') {
        $stmt = $pdo->prepare("DELETE FROM tijden WHERE id=:id");
        $stmt->execute([':id' => (int)$_POST['id']]);
        header('Location: tijden.php?flash=verwijderd');
        exit;
    }
}

// ── GET ────────────────────────────────────────────────────────────────────
$actie  = $_GET['actie'] ?? 'lijst';
$id     = (int)($_GET['id'] ?? 0);
$bewerk = null;

if ($actie === 'bewerk' && $id) {
    $stmt = $pdo->prepare("SELECT * FROM tijden WHERE id=:id");
    $stmt->execute([':id' => $id]);
    $bewerk = $stmt->fetch();
    if (!$bewerk) { header('Location: tijden.php'); exit; }
}

// Data voor dropdowns
$stages    = $pdo->query("SELECT * FROM stage ORDER BY id")->fetchAll();
$artiesten = $pdo->query("SELECT * FROM artiesten ORDER BY artiest")->fetchAll();

// Tijden met artiest- en stagenamen
$tijden = $pdo->query("
    SELECT t.*, a.artiest, s.naam AS stage_naam
    FROM tijden t
    JOIN artiesten a ON t.artiesten_id = a.id
    JOIN stage     s ON t.stage_id     = s.id
    ORDER BY t.dag, t.start_tijd
")->fetchAll();

$flashBerichten = [
    'aangemaakt' => ['Tijdslot aangemaakt!', 'success'],
    'bijgewerkt' => ['Tijdslot bijgewerkt!', 'success'],
    'verwijderd' => ['Tijdslot verwijderd!', 'success'],
];
if (isset($_GET['flash'], $flashBerichten[$_GET['flash']])) {
    [$flash, $flashType] = $flashBerichten[$_GET['flash']];
}

function e(string $v): string { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }
function tijdKort(string $t): string { return substr($t, 0, 5); } // "HH:MM"
function tijdInput(string $t): string { return substr($t, 0, 5); }
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Schema — ❤U Festival Admin</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="nav">
  <a href="index.php" class="nav-brand">❤<span>U</span> Admin</a>
  <a href="index.php">Dashboard</a>
  <a href="artiesten.php">Artiesten</a>
  <a href="tijden.php" class="active">Schema</a>
  <a href="info.php">Festival info</a>
</nav>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">Schema</h1>
    <?php if ($actie === 'lijst'): ?>
      <a href="?actie=nieuw" class="btn btn-primary">+ Tijdslot toevoegen</a>
    <?php endif; ?>
  </div>

  <?php if ($flash): ?>
    <div class="alert alert-<?= $flashType ?>"><?= e($flash) ?></div>
  <?php endif; ?>

  <?php if ($actie === 'nieuw' || $actie === 'bewerk'): ?>
  <div class="card">
    <div class="card-title">
      <?= $bewerk ? 'Tijdslot bewerken' : 'Nieuw tijdslot toevoegen' ?>
    </div>
    <form method="POST" action="tijden.php">
      <input type="hidden" name="actie" value="<?= $bewerk ? 'bijwerken' : 'aanmaken' ?>">
      <?php if ($bewerk): ?>
        <input type="hidden" name="id" value="<?= $bewerk['id'] ?>">
      <?php endif; ?>

      <div class="form-grid">
        <div class="field">
          <label>Dag *</label>
          <select name="dag" required>
            <option value="2026-09-05" <?= ($bewerk['dag'] ?? '') === '2026-09-05' ? 'selected' : '' ?>>
              Zaterdag 5 september 2026
            </option>
            <option value="2026-09-06" <?= ($bewerk['dag'] ?? '') === '2026-09-06' ? 'selected' : '' ?>>
              Zondag 6 september 2026
            </option>
          </select>
        </div>
        <div class="field">
          <label>Stage *</label>
          <select name="stage_id" required>
            <option value="">— kies een stage —</option>
            <?php foreach ($stages as $s): ?>
              <option value="<?= $s['id'] ?>"
                <?= ($bewerk['stage_id'] ?? 0) == $s['id'] ? 'selected' : '' ?>>
                <?= e(str_replace('_', ' ', $s['naam'])) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="field">
          <label>Starttijd *</label>
          <input type="time" name="start_tijd" required
                 value="<?= tijdInput($bewerk['start_tijd'] ?? '') ?>">
        </div>
        <div class="field">
          <label>Eindtijd *</label>
          <input type="time" name="eind_tijd" required
                 value="<?= tijdInput($bewerk['eind_tijd'] ?? '') ?>">
        </div>
        <div class="field full">
          <label>Artiest *</label>
          <select name="artiesten_id" required>
            <option value="">— kies een artiest —</option>
            <?php foreach ($artiesten as $a): ?>
              <option value="<?= $a['id'] ?>"
                <?= ($bewerk['artiesten_id'] ?? 0) == $a['id'] ? 'selected' : '' ?>>
                <?= e($a['artiest']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary"><?= $bewerk ? 'Opslaan' : 'Tijdslot aanmaken' ?></button>
        <a href="tijden.php" class="btn btn-secondary">Annuleren</a>
      </div>
    </form>
  </div>
  <?php endif; ?>

  <div class="card">
    <?php if (empty($tijden)): ?>
      <div class="empty">Nog geen tijdslots. Voeg er een toe via de knop hierboven.</div>
    <?php else:
      $huidigeDag = null;
      $dagLabels  = ['2026-09-05' => 'Zaterdag 5 september 2026', '2026-09-06' => 'Zondag 6 september 2026'];
      $dagBadge   = ['2026-09-05' => 'sat', '2026-09-06' => 'sun'];
    ?>
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>Artiest</th>
            <th>Stage</th>
            <th>Starttijd</th>
            <th>Eindtijd</th>
            <th style="width:140px">Acties</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($tijden as $t):
            $dag = substr($t['dag'], 0, 10);
            if ($dag !== $huidigeDag):
              $huidigeDag = $dag;
          ?>
          <tr class="day-separator">
            <td colspan="6">
              <span class="badge badge-<?= $dagBadge[$dag] ?? 'gray' ?>">
                <?= e($dagLabels[$dag] ?? $dag) ?>
              </span>
            </td>
          </tr>
          <?php endif; ?>
          <tr>
            <td style="color:var(--muted);font-size:12px"><?= $t['id'] ?></td>
            <td><strong><?= e($t['artiest']) ?></strong></td>
            <td>
              <span class="dot dot-<?= $stageDot[$t['stage_naam']] ?? '' ?>"></span>
              <?= e(str_replace('_', ' ', $t['stage_naam'])) ?>
            </td>
            <td><?= tijdKort($t['start_tijd']) ?></td>
            <td><?= tijdKort($t['eind_tijd']) ?></td>
            <td>
              <a href="?actie=bewerk&id=<?= $t['id'] ?>" class="btn btn-secondary btn-sm">Bewerk</a>
              <form method="POST" style="display:inline"
                    onsubmit="return confirm('Tijdslot verwijderen?')">
                <input type="hidden" name="actie" value="verwijderen">
                <input type="hidden" name="id"    value="<?= $t['id'] ?>">
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
