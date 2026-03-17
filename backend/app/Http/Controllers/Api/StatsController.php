<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\User;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Get admin dashboard statistics.
     */
    public function index()
    {
        // Chiffre d'affaires total (commandes payées)
        $totalRevenue = Commande::where('statut', 'paye')
            ->orWhere('statut', 'payé')
            ->sum('montant_total');

        // Nombre total de billets vendus
        $totalTicketsSold = Billet::whereHas('commande', function($query) {
            $query->where('statut', 'paye')->orWhere('statut', 'payé');
        })->count();

        // Nombre total d'utilisateurs
        $totalUsers = User::count();

        // Événements actifs
        $activeEventsCount = \App\Models\Evenement::count();

        // Tendances des ventes (optionnel, pour plus tard si besoin)
        // Ici on retourne juste les totaux demandés par l'utilisateur
        
        return response()->json([
            'revenue' => (float)$totalRevenue,
            'tickets_sold' => $totalTicketsSold,
            'users_count' => $totalUsers,
            'active_events' => $activeEventsCount
        ]);
    }
}
