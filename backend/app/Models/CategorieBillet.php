<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategorieBillet extends Model
{
    use HasFactory;

    // To prevent pluralization issues if Laravel looks for 'categorie_billets'
    protected $table = 'categorie_billets'; 

    protected $fillable = [
        'evenement_id',
        'libelle',
        'prix',
        'quantite_totale',
        'quantite_restante',
    ];

    protected $casts = [
        'prix' => 'decimal:2',
    ];

    public function evenement(): BelongsTo
    {
        return $this->belongsTo(Evenement::class);
    }

    public function billets(): HasMany
    {
        return $this->hasMany(Billet::class, 'categorie_id');
    }
}
