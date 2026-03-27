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
            [
                'nom' => 'CICES',
                'adresse' => 'Foire',
                'ville' => 'Dakar',
                'capacite' => 10000,
            ],
            [
                'nom' => 'Musée des Civilisations Noires',
                'adresse' => 'Plateau',
                'ville' => 'Dakar',
                'capacite' => 2000,
            ],
            [
                'nom' => 'Canal Olympia Teranga',
                'adresse' => 'Plateau',
                'ville' => 'Dakar',
                'capacite' => 4500,
            ],
        ];

        foreach ($lieux as $l) {
            Lieu::updateOrCreate(['nom' => $l['nom']], $l);
        }

        // 3. Create Events
        $lieu1 = Lieu::where('nom', 'Grand Théâtre National')->first();
        $lieu2 = Lieu::where('nom', 'Monument de la Renaissance')->first();
        $lieu3 = Lieu::where('nom', 'Stade Abdoulaye Wade')->first();
        $lieu4 = Lieu::where('nom', 'CICES')->first();
        $lieu5 = Lieu::where('nom', 'Musée des Civilisations Noires')->first();
        $lieu6 = Lieu::where('nom', 'Canal Olympia Teranga')->first();

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
            [
                'lieu_id' => $lieu3->id,
                'titre' => 'Grand Combat: Modou Lô vs Balla Gaye 2',
                'description' => 'Le choc tant attendu de la lutte sénégalaise avec frappe. Venez vibrer au rythme du lamb dans le majestueux Stade Abdoulaye Wade.',
                'date' => now()->addDays(60),
                'image_url' => 'https://images.unsplash.com/photo-1552072092-7f9b8d63d499?auto=format&fit=crop&q=80', // Wrestling/Sports vibe
            ],
            [
                'lieu_id' => $lieu6->id,
                'titre' => 'Youssou N\'Dour - Le Grand Bal',
                'description' => 'Le roi du Mbalakh de retour pour un spectacle inoubliable mêlant rythme, tradition et messages engagés.',
                'date' => now()->addDays(15),
                'image_url' => 'https://images.unsplash.com/photo-1540039155732-d672d423b06c?auto=format&fit=crop&q=80', // Concert vibe
            ],
            [
                'lieu_id' => $lieu1->id,
                'titre' => 'Dakar Comedy Show',
                'description' => 'Les meilleurs humoristes du Sénégal et d\'Afrique réunis pour la première fois pour une nuit riche en fous rires.',
                'date' => now()->addDays(10),
                'image_url' => 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80', // Standup vibe
            ],
            [
                'lieu_id' => $lieu5->id,
                'titre' => 'Exposition d\'Art Contemporain Panafricain',
                'description' => 'Découvrez les œuvres magistrales de sculpteurs et peintres venus des quatre coins du continent noir.',
                'date' => now()->addDays(5),
                'image_url' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80', // Art expo vibe
            ],
            [
                'lieu_id' => $lieu4->id,
                'titre' => 'Foire Internationale de Dakar (FIDAK)',
                'description' => 'Le grand rendez-vous commercial annuel. Artisans, entreprises et commerçants partagent leurs innovations.',
                'date' => now()->addDays(20),
                'image_url' => 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80', // Expo/Fair vibe
            ],
            [
                'lieu_id' => $lieu2->id,
                'titre' => 'Galsen Hip Hop Festival',
                'description' => 'Les légendes du rap Galsen (Dip, NitDoff, Nix) enflamment le Monument de la Renaissance.',
                'date' => now()->addDays(12),
                'image_url' => 'https://images.unsplash.com/photo-1520166946654-e0c1f60100fe?auto=format&fit=crop&q=80', // Hip hop vibe
            ]
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
