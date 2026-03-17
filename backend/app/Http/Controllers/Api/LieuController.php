<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lieu;
use Illuminate\Http\Request;

class LieuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Lieu::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:255',
            'adresse'  => 'required|string|max:255',
            'ville'    => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
        ]);

        $lieu = Lieu::create($validated);

        return response()->json($lieu, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lieu $lieu)
    {
        return response()->json($lieu);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lieu $lieu)
    {
        $validated = $request->validate([
            'nom'      => 'sometimes|required|string|max:255',
            'adresse'  => 'sometimes|required|string|max:255',
            'ville'    => 'sometimes|required|string|max:255',
            'capacite' => 'sometimes|required|integer|min:1',
        ]);

        $lieu->update($validated);

        return response()->json($lieu);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lieu $lieu)
    {
        $lieu->delete();

        return response()->json(['message' => 'Lieu supprimé avec succès.']);
    }
}
