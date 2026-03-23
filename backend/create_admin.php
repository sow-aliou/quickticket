<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = User::updateOrCreate(
        ['email' => 'admin@ticketpulse.sn'],
        [
            'name' => 'Administrateur',
            'password' => Hash::make('adminpassword'),
            'role' => 'admin'
        ]
    );
    echo "SUCCESS: Admin user created/updated with email: " . $user->email . "\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
