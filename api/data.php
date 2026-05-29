<?php
require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Fallback: als EN leeg is, gebruik NL
function fb(string $en, string $nl): string {
    return trim($en) !== '' ? $en : $nl;
}

// ── Stages ────────────────────────────────────────────────────────────────
$stageMap = [
    'Ponton'   => ['id' => 'ponton', 'tone' => '',         'img' => '/img/ponton.webp'],
    'The_Lake' => ['id' => 'lake',   'tone' => 's-lake',   'img' => '/img/lake.webp'],
    'The_Club' => ['id' => 'club',   'tone' => 's-club',   'img' => '/img/club.webp'],
    'Hangar'   => ['id' => 'hangar', 'tone' => 's-hangar', 'img' => '/img/hangar.webp'],
];
$stageDesc = [
    'ponton' => ['nl' => 'Main stage — hoofdacts',   'en' => 'Main stage — headliners'],
    'lake'   => ['nl' => 'Onbekend talent',           'en' => 'Emerging talent'],
    'club'   => ['nl' => 'Theater & stand-up',        'en' => 'Theatre & stand-up'],
    'hangar' => ['nl' => 'Non-stop house & techno',   'en' => 'Non-stop house & techno'],
];

$stageRows       = $pdo->query("SELECT * FROM stage ORDER BY id")->fetchAll();
$stageDbToApp    = []; // db-id → app-slug
$stages          = [];

foreach ($stageRows as $row) {
    $meta  = $stageMap[$row['naam']] ?? [
        'id'   => strtolower(str_replace(['The_', '_'], ['', ''], $row['naam'])),
        'tone' => '',
        'img'  => '/img/' . strtolower($row['naam']) . '.webp',
    ];
    $appId = $meta['id'];
    $stageDbToApp[$row['id']] = $appId;
    $stages[] = [
        'id'   => $appId,
        'name' => str_replace('_', ' ', $row['naam']),
        'tone' => $meta['tone'],
        'img'  => $meta['img'],
        'desc' => $stageDesc[$appId] ?? ['nl' => '', 'en' => ''],
    ];
}

// ── Tijden → minuten na 10:00 ─────────────────────────────────────────────
function toMins(string $t): int {
    [$h, $m] = explode(':', $t);
    return (intval($h) - 10) * 60 + intval($m);
}

$tijdenRows = $pdo->query("
    SELECT t.start_tijd, t.eind_tijd, t.dag, t.stage_id, a.artiest
    FROM tijden t
    JOIN artiesten a ON t.artiesten_id = a.id
    ORDER BY t.dag, t.start_tijd
")->fetchAll();

$sat = [];
$sun = [];
foreach ($tijdenRows as $row) {
    $entry = [
        'stage' => $stageDbToApp[$row['stage_id']] ?? 'ponton',
        'start' => toMins($row['start_tijd']),
        'end'   => toMins($row['eind_tijd']),
        'act'   => $row['artiest'],
    ];
    $dag = substr($row['dag'], 0, 10);
    if ($dag === '2026-09-05') {
        $sat[] = $entry;
    } elseif ($dag === '2026-09-06') {
        $sun[] = $entry;
    }
}

// ── Artiesten ─────────────────────────────────────────────────────────────
$artiestenRows = $pdo->query("SELECT * FROM artiesten ORDER BY id")->fetchAll();
$acts = [];
foreach ($artiestenRows as $row) {
    $acts[$row['artiest']] = [
        'role' => [
            'nl' => $row['type_act'],
            'en' => fb($row['type_act'], $row['type_act']),
        ],
        'desc' => [
            'nl' => $row['beschrijving_nl'],
            'en' => fb($row['beschrijving_en'], $row['beschrijving_nl']),
        ],
        'foto' => $row['foto'],
    ];
}

// ── Info ──────────────────────────────────────────────────────────────────
$infoRows = $pdo->query("SELECT * FROM info ORDER BY id")->fetchAll();

// Groepeer op Nederlandse titel (stabiele sleutel)
$grouped = [];
foreach ($infoRows as $row) {
    $grouped[$row['title']][] = $row;
}

// Icon-mapping voor bereikbaarheid-regels
$iconMap = [
    'Fiets'              => 'directions_bike',
    'Auto'               => 'directions_car',
    'OV'                 => 'train',
    'Shuttlebus'         => 'directions_bus',
    'Taxi + Kiss & Ride' => 'local_taxi',
    'Taxi & Kiss & Ride' => 'local_taxi',
];

function buildInfo(array $grouped, string $lang, callable $fb): array {
    global $iconMap;
    $nl = $lang === 'nl';

    // ─ Algemeen ──────────────────────────────────────────────────
    $adres    = '';
    $navAdres = '';
    $datum    = '';
    $tijden   = '';
    foreach ($grouped['Algemeen & contact'] ?? [] as $r) {
        $val = $nl ? $r['bericht'] : $fb($r['bericht_en'], $r['bericht']);
        match ($r['sub_title']) {
            'Locatie'          => $adres    = $val,
            'Navigatieadres'   => $navAdres = $val,
            'Datum'            => $datum    = $nl ? $r['bericht'] : $fb($r['bericht_en'], $r['bericht']),
            'Openingstijden'   => $tijden   = $nl ? $r['bericht'] : $fb($r['bericht_en'], $r['bericht']),
            default            => null,
        };
    }

    // ─ Bereikbaarheid ────────────────────────────────────────────
    $access = [];
    foreach ($grouped['Bereikbaarheid'] ?? [] as $r) {
        $access[] = [
            'icon'  => $iconMap[$r['sub_title']] ?? 'directions',
            'title' => $nl ? $r['sub_title'] : $fb($r['sub_title_en'], $r['sub_title']),
            'body'  => $nl ? $r['bericht']   : $fb($r['bericht_en'],   $r['bericht']),
        ];
    }

    // ─ Kluisjes ──────────────────────────────────────────────────
    $lockerBody = '';
    foreach ($grouped['Kluisjes'] ?? [] as $r) {
        $lockerBody = $nl ? $r['bericht'] : $fb($r['bericht_en'], $r['bericht']);
    }

    // ─ FAQ ───────────────────────────────────────────────────────
    $faq = [];
    foreach ($grouped['FAQ'] ?? [] as $r) {
        $faq[] = [
            'q' => $nl ? $r['sub_title'] : $fb($r['sub_title_en'], $r['sub_title']),
            'a' => $nl ? $r['bericht']   : $fb($r['bericht_en'],   $r['bericht']),
        ];
    }

    // ─ Golden-GLU ────────────────────────────────────────────────
    $gold = '';
    foreach ($grouped['Golden-GLU'] ?? [] as $r) {
        $gold = $nl ? $r['bericht'] : $fb($r['bericht_en'], $r['bericht']);
    }

    // ─ Sectietitels ──────────────────────────────────────────────
    $sectionTitle = function(string $nlKey) use ($nl, $grouped, $fb): string {
        if ($nl) return $nlKey;
        $rows = $grouped[$nlKey] ?? [];
        return $rows ? $fb($rows[0]['title_en'], $nlKey) : $nlKey;
    };

    return [
        'title'      => 'Festival info',
        'sub'        => $nl ? 'Alles wat je moet weten' : 'Everything you need to know',
        'sections'   => [
            'general' => $sectionTitle('Algemeen & contact'),
            'access'  => $sectionTitle('Bereikbaarheid'),
            'lockers' => $sectionTitle('Kluisjes'),
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

$infoNl = buildInfo($grouped, 'nl', 'fb');
$infoEn = buildInfo($grouped, 'en', 'fb');

// ── Output ────────────────────────────────────────────────────────────────
echo json_encode([
    'stages' => $stages,
    'sat'    => $sat,
    'sun'    => $sun,
    'acts'   => $acts,
    'info'   => ['nl' => $infoNl, 'en' => $infoEn],
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
