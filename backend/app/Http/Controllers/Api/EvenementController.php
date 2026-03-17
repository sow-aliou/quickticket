<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\CategorieBillet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->cleanupPastEvents();

        $evenements = Evenement::with('lieu')
            ->withMin('categoriesBillets as prix_min', 'prix')
            ->withSum('categoriesBillets as total_restant', 'quantite_restante')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($evenements);
    }

    /**
     * Liste des événements avec statistiques pour l'administration.
     */
    public function adminIndex()
    {
        $evenements = Evenement::with(['lieu', 'categoriesBillets'])
            ->withCount('billets as billets_vendus')
            ->orderBy('date', 'desc')
            ->get();

        // Calculer le chiffre d'affaires et les billets restants pour chaque événement
        $evenements->each(function ($evenement) {
            $evenement->chiffre_affaire = $evenement->billets()
                ->sum('categorie_billets.prix');
            
            $evenement->billets_restants = $evenement->categoriesBillets->sum('quantite_restante');
            
            // On peut aussi inclure le prix min pour l'affichage
            $evenement->prix_min = $evenement->categoriesBillets->min('prix');
        });

        return response()->json($evenements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'date'               => 'required|date',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'image_url'          => 'nullable|string|max:2048',
            'lieu_id'            => 'required|exists:lieus,id',
            'categories_billets' => 'required|array|min:1',
            'categories_billets.*.libelle'         => 'required|string|max:255',
            'categories_billets.*.prix'            => 'required|numeric|min:0',
            'categories_billets.*.quantite_totale' => 'required|integer|min:1',
        ]);

        // Gestion de l'image uploadée
        $imageUrl = $validated['image_url'] ?? null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('evenements', 'public');
            $imageUrl = Storage::url($path);
        }

        return DB::transaction(function () use ($validated, $imageUrl) {
            $evenement = Evenement::create([
                'titre'       => $validated['titre'],
                'description' => $validated['description'] ?? null,
                'date'        => $validated['date'],
                'image_url'   => $imageUrl,
                'lieu_id'     => $validated['lieu_id'],
            ]);

            foreach ($validated['categories_billets'] as $cat) {
                $evenement->categoriesBillets()->create([
                    'libelle'           => $cat['libelle'],
                    'prix'              => $cat['prix'],
                    'quantite_totale'   => $cat['quantite_totale'],
                    'quantite_restante' => $cat['quantite_totale'],
                ]);
            }

            return response()->json($evenement->load(['lieu', 'categoriesBillets']), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $evenement = Evenement::with(['lieu', 'categoriesBillets'])
            ->findOrFail($id);

        return response()->json($evenement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $evenement = Evenement::findOrFail($id);

        $validated = $request->validate([
            'titre'              => 'sometimes|required|string|max:255',
            'description'        => 'nullable|string',
            'date'               => 'sometimes|required|date',
            'image'              => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'image_url'          => 'nullable|string|max:2048',
            'lieu_id'            => 'sometimes|required|exists:lieus,id',
            'categories_billets' => 'sometimes|array|min:1',
            'categories_billets.*.id'              => 'sometimes|exists:categorie_billets,id',
            'categories_billets.*.libelle'         => 'required|string|max:255',
            'categories_billets.*.prix'            => 'required|numeric|min:0',
            'categories_billets.*.quantite_totale' => 'required|integer|min:1',
        ]);

        // Gestion de l'image uploadée lors de la mise à jour
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle était stockée localement
            if ($evenement->image_url && str_starts_with($evenement->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $evenement->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('evenements', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        return DB::transaction(function () use ($validated, $evenement) {
            $evenement->update(collect($validated)->except(['categories_billets', 'image'])->toArray());

            if (isset($validated['categories_billets'])) {
                $existingIds = collect($validated['categories_billets'])->pluck('id')->filter()->toArray();
                
                // Supprimer les catégories qui ne sont plus envoyées
                $evenement->categoriesBillets()->whereNotIn('id', $existingIds)->delete();

                foreach ($validated['categories_billets'] as $cat) {
                    if (isset($cat['id'])) {
                        $categorie = CategorieBillet::findOrFail($cat['id']);
                        
                        // Si la quantité totale change, on ajuste la quantité restante (attention aux calculs simplifiés ici)
                        $diff = $cat['quantite_totale'] - $categorie->quantite_totale;
                        
                        $categorie->update([
                            'libelle'           => $cat['libelle'],
                            'prix'              => $cat['prix'],
                            'quantite_totale'   => $cat['quantite_totale'],
                            'quantite_restante' => max(0, $categorie->quantite_restante + $diff),
                        ]);
                    } else {
                        $evenement->categoriesBillets()->create([
                            'libelle'           => $cat['libelle'],
                            'prix'              => $cat['prix'],
                            'quantite_totale'   => $cat['quantite_totale'],
                            'quantite_restante' => $cat['quantite_totale'],
                        ]);
                    }
                }
            }

            return response()->json($evenement->load(['lieu', 'categoriesBillets']));
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $evenement = Evenement::findOrFail($id);
        $evenement->delete();

        return response()->json(['message' => 'Événement supprimé avec succès.']);
    }

    /**
     * Supprime (soft delete) les événements dont la date est passée.
     */
    private function cleanupPastEvents()
    {
        Evenement::where('date', '<', now())->delete();
    }
}
