<?php
error_reporting(0);
ini_set('display_errors', 0);

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
$stageDbToApp = [];
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

$dateRows  = $pdo->query("SELECT DISTINCT dag FROM tijden ORDER BY dag")->fetchAll();
$dayKeys   = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
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
$infoRows = $pdo->query("SELECT * FROM info ORDER BY id")->fetchAll();

$grouped = [];
foreach ($infoRows as $row) {
    $grouped[$row['title']][] = $row;
}

$iconMap = [
    'Fiets'              => 'directions_bike',
    'Auto'               => 'directions_car',
    'OV'                 => 'train',
    'Shuttlebus'         => 'directions_bus',
    'Taxi + Kiss & Ride' => 'local_taxi',
    'Taxi & Kiss & Ride' => 'local_taxi',
];

function buildInfo(array $grouped, string $lang): array
{
    global $iconMap;
    $nl = $lang === 'nl';

    $adres = $navAdres = $datum = $tijden = '';
    foreach ($grouped['Algemeen & contact'] ?? [] as $r) {
        $val = $nl ? $r['bericht'] : fb($r['bericht_en'], $r['bericht']);
        match ($r['sub_title']) {
            'Locatie'        => $adres    = $val,
            'Navigatieadres' => $navAdres = $val,
            'Datum'          => $datum    = $val,
            'Openingstijden' => $tijden   = $val,
            default          => null,
        };
    }

    $access = [];
    foreach ($grouped['Bereikbaarheid'] ?? [] as $r) {
        $access[] = [
            'icon'  => $iconMap[$r['sub_title']] ?? 'directions',
            'title' => $nl ? $r['sub_title'] : fb($r['bericht_en'], $r['sub_title']),
            'body'  => $nl ? $r['bericht'] : fb($r['bericht_en'], $r['bericht']),
        ];
    }

    $lockerBody = '';
    foreach ($grouped['Kluisjes'] ?? [] as $r) {
        $lockerBody = $nl ? $r['bericht'] : fb($r['bericht_en'], $r['bericht']);
    }

    $faq = [];
    foreach ($grouped['FAQ'] ?? [] as $r) {
        $faq[] = [
            'q' => $nl ? $r['sub_title'] : fb($r['bericht_en'], $r['sub_title']),
            'a' => $nl ? $r['bericht']   : fb($r['bericht_en'], $r['bericht']),
        ];
    }

    $gold = '';
    foreach ($grouped['Golden-GLU'] ?? [] as $r) {
        $gold = $nl ? $r['bericht'] : fb($r['bericht_en'], $r['bericht']);
    }

    return [
        'title'      => 'Festival info',
        'sub'        => $nl ? 'Alles wat je moet weten' : 'Everything you need to know',
        'sections'   => [
            'general' => 'Algemeen & contact',
            'access'  => 'Bereikbaarheid',
            'lockers' => 'Kluisjes',
            'faq'     => 'FAQ',
            'gold'    => 'Golden-GLU',
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
        ['stages' => $stages, 'acts' => $acts, 'info' => ['nl' => buildInfo($grouped, 'nl'), 'en' => buildInfo($grouped, 'en')]],
        $schedule
    ),
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);
