<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name',             'value' => 'QuickTicket',            'label' => 'Nom du site',                    'type' => 'string'],
            ['key' => 'contact_email',         'value' => 'contact@quickticket.sn', 'label' => 'Email de contact',               'type' => 'string'],
            ['key' => 'contact_phone',         'value' => '+221 77 000 00 00',      'label' => 'Téléphone / WhatsApp',           'type' => 'string'],
            ['key' => 'max_tickets_per_order', 'value' => '10',                     'label' => 'Max billets par commande',        'type' => 'string'],
            ['key' => 'currency',              'value' => 'FCFA',                   'label' => 'Devise',                         'type' => 'string'],
            ['key' => 'registration_open',     'value' => '1',                      'label' => 'Inscriptions ouvertes',          'type' => 'boolean'],
            ['key' => 'maintenance_mode',      'value' => '0',                      'label' => 'Mode maintenance',               'type' => 'boolean'],
            ['key' => 'show_sold_out',         'value' => '1',                      'label' => 'Afficher événements complets',   'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
