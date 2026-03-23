<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting Database Refresh...\n";

try {
    // Delete the sqlite file first to be absolutely fresh
    $dbPath = database_path('database.sqlite');
    if (file_exists($dbPath)) {
        unlink($dbPath);
        echo "Deleted old database.sqlite\n";
    }
    touch($dbPath);
    echo "Created new database.sqlite\n";

    echo "Running migrate:fresh...\n";
    Artisan::call('migrate:fresh', ['--force' => true]);
    echo Artisan::output();

    echo "Running db:seed...\n";
    Artisan::call('db:seed', ['--force' => true]);
    echo Artisan::output();

    echo "SUCCESS: Database refreshed and seeded.\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
