<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        // On récupère les commandes de l'utilisateur avec les billets, 
        // les catégories de billets et l'événement associé via la catégorie.
        $commandes = Commande::where('utilisateur_id', $user->id)
            ->with(['billets.categorie.evenement' => function($q) {
                $q->withTrashed();
            }, 'billets.categorie'])
            ->latest()
            ->get();

        // On formate un peu pour faciliter l'affichage au front (inclure l'événement au niveau commande)
        $commandes->each(function($commande) {
            if ($commande->billets->count() > 0) {
                // On prend l'événement du premier billet (tous les billets d'une commande sont pour le même événement dans cette app)
                $commande->evenement = $commande->billets->first()->categorie->evenement;
            }
        });

        return response()->json($commandes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'total' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.categoryId' => 'required|exists:categorie_billets,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return \DB::transaction(function () use ($validated) {
            $user = auth()->user();

            // 1. Créer la commande
            $commande = Commande::create([
                'utilisateur_id' => $user->id,
                'montant_total' => $validated['total'],
                'statut' => 'paye',
            ]);

            // 2. Créer les billets et mettre à jour le stock
            foreach ($validated['items'] as $item) {
                $category = \App\Models\CategorieBillet::lockForUpdate()->find($item['categoryId']);

                if ($category->quantite_restante < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour la catégorie : " . $category->libelle);
                }

                for ($i = 0; $i < $item['quantity']; $i++) {
                    $commande->billets()->create([
                        'categorie_id' => $category->id,
                        'code_unique' => (string) \Illuminate\Support\Str::uuid(),
                    ]);
                }

                // Décrémenter le stock
                $category->decrement('quantite_restante', $item['quantity']);
            }

            return response()->json($commande->load(['billets.categorie.evenement' => function($q) {
                $q->withTrashed();
            }]), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Commande $commande)
    {
        $user = auth()->user();
        if ($user->id !== $commande->utilisateur_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $commande->load(['billets.categorie.evenement' => function($q) {
            $q->withTrashed();
        }, 'billets.categorie.evenement.lieu']);

        // Formater l'événement global de la commande
        if ($commande->billets->count() > 0) {
            $commande->evenement = $commande->billets->first()->categorie->evenement;
        }

        return response()->json($commande);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Commande $commande)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Commande $commande)
    {
        //
    }
}
