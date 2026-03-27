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
                'description' => 'Une soirée exceptionnelle avec le prodige de la musique sénégalaise au Grand Théâtre.',
                'date' => now()->addDays(30),
                'image_url' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu6->id,
                'titre' => 'Viviane Chidid - Soirée Djolof Band',
                'description' => 'La Reine du Mbalax en concert pour une nuit de rythmes endiablés au Canal Olympia.',
                'date' => now()->addDays(45),
                'image_url' => 'https://images.unsplash.com/photo-1540039155732-d672d423b06c?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu3->id,
                'titre' => 'Youssou N\'Dour - Le Grand Bal de Diamniadio',
                'description' => 'Le Roi de la musique sénégalaise investit le Stade Abdoulaye Wade pour un spectacle historique.',
                'date' => now()->addDays(60),
                'image_url' => 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu2->id,
                'titre' => 'Jeeba - Concert Abana Tour',
                'description' => 'Venez découvrir l\'univers Italo-Galsen de Jeeba au pied du Monument de la Renaissance.',
                'date' => now()->addDays(15),
                'image_url' => 'https://images.unsplash.com/photo-1520166946654-e0c1f60100fe?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu1->id,
                'titre' => 'Pape Diouf - Le Grand Bégué',
                'description' => 'Le leader de la Génération Consciente vous donne rendez-vous pour une nuit de Mbalax pur.',
                'date' => now()->addDays(10),
                'image_url' => 'https://images.unsplash.com/photo-1540039155732-d672d423b06c?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu6->id,
                'titre' => 'Sidy Diop - Show Case Exceptionnel',
                'description' => 'Le phénomène Sidy Diop enflamme le Canal Olympia avec ses derniers succès.',
                'date' => now()->addDays(25),
                'image_url' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu5->id,
                'titre' => 'Dip Doundou Guiss - Dakar Hip Hop Live',
                'description' => 'Le King du Rap Galsen en concert pour la sortie de son nouvel album au Musée des Civilisations.',
                'date' => now()->addDays(20),
                'image_url' => 'https://images.unsplash.com/photo-1520166946654-e0c1f60100fe?auto=format&fit=crop&q=80',
            ],
            [
                'lieu_id' => $lieu2->id,
                'titre' => 'Festival Reggae Sénégal',
                'description' => 'Une nuit entière dédiée au Reggae avec les meilleurs artistes locaux et internationaux.',
                'date' => now()->addDays(12),
                'image_url' => 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80',
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
