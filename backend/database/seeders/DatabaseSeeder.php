<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Lieu;
use App\Models\Evenement;
use App\Models\CategorieBillet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admins and Users
        User::updateOrCreate(
            ['email' => 'admin@ticketpulse.sn'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client@ticketpulse.sn'],
            [
                'name' => 'Abou SOW',
                'password' => Hash::make('password'),
                'role' => 'client',
            ]
        );
        // 2. Create Venues (Lieux)
        $lieux = [
            [
                'nom' => 'Grand Théâtre National',
                'adresse' => 'Rocade Fann Bel-Air',
                'ville' => 'Dakar',
                'capacite' => 1800,
            ],
            [
                'nom' => 'Monument de la Renaissance',
                'adresse' => 'Ouakam',
                'ville' => 'Dakar',
                'capacite' => 5000,
            ],
            [
                'nom' => 'Stade Abdoulaye Wade',
                'adresse' => 'Diamniadio',
                'ville' => 'Dakar',
                'capacite' => 50000,
            ],
        ];

        foreach ($lieux as $l) {
            Lieu::updateOrCreate(['nom' => $l['nom']], $l);
        }

        // 3. Create Events
        $lieu1 = Lieu::where('nom', 'Grand Théâtre National')->first();
        $lieu2 = Lieu::where('nom', 'Monument de la Renaissance')->first();

        $events = [
            [
                'lieu_id' => $lieu1->id,
                'titre' => 'Concert Acoustique Waly Seck',
                'description' => 'Une soirée exceptionnelle avec le prodige de la musique sénégalaise.',
                'date' => now()->addDays(30),
                'image_url' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu2->id,
                'titre' => 'Dakar Fashion Week',
                'description' => 'Le plus grand événement de mode en Afrique de l\'Ouest.',
                'date' => now()->addDays(45),
                'image_url' => 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($events as $e) {
            $event = Evenement::updateOrCreate(['titre' => $e['titre']], $e);

            // Create Ticket Categories for each event
            CategorieBillet::updateOrCreate(
                ['evenement_id' => $event->id, 'libelle' => 'Standard'],
                ['prix' => 10000, 'quantite_totale' => 500, 'quantite_restante' => 500]
            );
            CategorieBillet::updateOrCreate(
                ['evenement_id' => $event->id, 'libelle' => 'VIP'],
                ['prix' => 25000, 'quantite_totale' => 100, 'quantite_restante' => 100]
            );
        }
        
        // Also call SettingSeeder
        $this->call(SettingSeeder::class);
    }
}
