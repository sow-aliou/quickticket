<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Billet extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'categorie_id',
        'code_unique',
        'est_scanne',
    ];

    protected $casts = [
        'est_scanne' => 'boolean',
    ];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(CategorieBillet::class, 'categorie_id');
    }
}
