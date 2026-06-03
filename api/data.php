<?php
require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Fallback: als EN leeg is, gebruik NL
function fb(string $en, string $nl): string
{
    return trim($en) !== '' ? $en : $nl;
}

// ── Stages ────────────────────────────────────────────────────────────────
$stageRows    = $pdo->query("SELECT * FROM stage ORDER BY id")->fetchAll();
$stageDbToApp = []; // db-id → slug
$stages       = [];

foreach ($stageRows as $row) {
    $slug = strtolower(str_replace(['The_', '_', ' '], ['', '', ''], $row['naam']));
    $stageDbToApp[$row['id']] = $slug;
    $stages[] = [
        'id'   => $slug,
        'name' => str_replace('_', ' ', $row['naam']),
        'tone' => '',
        'img'  => $row['foto'],
        'desc' => ['nl' => '', 'en' => ''],
    ];
}

// ── Tijden → minuten na 10:00 ─────────────────────────────────────────────
function toMins(string $t): int
{
    [$h, $m] = explode(':', $t);
    return (intval($h) - 10) * 60 + intval($m);
}

// Haal de unieke festivaldagen op in volgorde; eerste dag = sat, tweede = sun
$dateRows = $pdo->query("SELECT DISTINCT dag FROM tijden ORDER BY dag")->fetchAll();
$dayKeys  = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
$dateToKey = [];
foreach ($dateRows as $i => $dr) {
    $dateToKey[substr($dr['dag'], 0, 10)] = $dayKeys[$i] ?? "day{$i}";
}

$tijdenRows = $pdo->query("
    SELECT t.start_tijd, t.eind_tijd, t.dag, t.stage_id, a.artiest
    FROM tijden t
    JOIN artiesten a ON t.artiesten_id = a.id
    ORDER BY t.dag, t.start_tijd
")->fetchAll();

$schedule = array_fill_keys(array_values($dateToKey), []);
foreach ($tijdenRows as $row) {
    $key = $dateToKey[substr($row['dag'], 0, 10)] ?? null;
    if ($key === null) continue;
    $schedule[$key][] = [
        'stage' => $stageDbToApp[$row['stage_id']] ?? ($stages[0]['id'] ?? 'ponton'),
        'start' => toMins($row['start_tijd']),
        'end'   => toMins($row['eind_tijd']),
        'act'   => $row['artiest'],
    ];
}

// ── Artiesten ─────────────────────────────────────────────────────────────
$artiestenRows = $pdo->query("SELECT * FROM artiesten ORDER BY id")->fetchAll();
$acts = [];
foreach ($artiestenRows as $row) {
    $acts[$row['artiest']] = [
        'role' => ['nl' => $row['type_act'],        'en' => fb($row['type_act'],        $row['type_act'])],
        'desc' => ['nl' => $row['beschrijving_nl'], 'en' => fb($row['beschrijving_en'], $row['beschrijving_nl'])],
        'foto' => $row['foto'],
    ];
}

// ── Info ──────────────────────────────────────────────────────────────────
$infoRows  = $pdo->query("SELECT * FROM info ORDER BY id")->fetchAll();
$bySection = [];
foreach ($infoRows as $row) {
    $bySection[$row['section']][] = $row;
}

function buildInfo(array $bySection, string $lang): array
{
    $nl = $lang === 'nl';

    $t = fn(string $nl_val, string $en_val): string => $nl ? $nl_val : fb($en_val, $nl_val);

    // Sectietitel ophalen uit eerste rij van die sectie
    $sectionTitle = function (string $key) use ($bySection, $nl): string {
        $rows = $bySection[$key] ?? [];
        return $rows ? ($nl ? $rows[0]['title'] : fb($rows[0]['title_en'], $rows[0]['title'])) : '';
    };

    // Algemeen & contact
    $adres = $navAdres = $datum = $tijden = '';
    foreach ($bySection['general'] ?? [] as $r) {
        $val = $t($r['bericht'], $r['bericht_en']);
        match ($r['field']) {
            'adres'    => $adres    = $val,
            'navAdres' => $navAdres = $val,
            'datum'    => $datum    = $val,
            'tijden'   => $tijden   = $val,
            default    => null,
        };
    }

    // Bereikbaarheid
    $access = [];
    foreach ($bySection['access'] ?? [] as $r) {
        $access[] = [
            'icon'  => $r['icon'] ?: 'directions',
            'title' => $t($r['sub_title'], $r['sub_title_en']),
            'body'  => $t($r['bericht'],   $r['bericht_en']),
        ];
    }

    // Kluisjes
    $lockerBody = '';
    foreach ($bySection['lockers'] ?? [] as $r) {
        $lockerBody = $t($r['bericht'], $r['bericht_en']);
    }

    // FAQ
    $faq = [];
    foreach ($bySection['faq'] ?? [] as $r) {
        $faq[] = [
            'q' => $t($r['sub_title'], $r['sub_title_en']),
            'a' => $t($r['bericht'],   $r['bericht_en']),
        ];
    }

    // Golden-GLU
    $gold = '';
    foreach ($bySection['golden'] ?? [] as $r) {
        $gold = $t($r['bericht'], $r['bericht_en']);
    }

    return [
        'title'      => 'Festival info',
        'sub'        => $nl ? 'Alles wat je moet weten' : 'Everything you need to know',
        'sections'   => [
            'general' => $sectionTitle('general'),
            'access'  => $sectionTitle('access'),
            'lockers' => $sectionTitle('lockers'),
            'faq'     => $sectionTitle('faq'),
            'gold'    => $sectionTitle('golden'),
        ],
        'adres'      => $adres,
        'navAdres'   => $navAdres,
        'date'       => trim($datum . ($tijden ? ', ' . $tijden : '')),
        'access'     => $access,
        'lockerBody' => $lockerBody,
        'faq'        => $faq,
        'gold'       => $gold,
    ];
}

// ── Output ────────────────────────────────────────────────────────────────
echo json_encode(
    array_merge(
        ['stages' => $stages, 'acts' => $acts, 'info' => ['nl' => buildInfo($bySection, 'nl'), 'en' => buildInfo($bySection, 'en')]],
        $schedule
    ),
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);
