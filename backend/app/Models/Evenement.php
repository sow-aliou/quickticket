<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;


class Evenement extends Model
{
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'lieu_id',
        'titre',
        'description',
        'date',
        'image_url',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function lieu(): BelongsTo
    {
        return $this->belongsTo(Lieu::class);
    }

    public function categoriesBillets(): HasMany
    {
        return $this->hasMany(CategorieBillet::class);
    }

    public function billets(): HasManyThrough
    {
        return $this->hasManyThrough(Billet::class, CategorieBillet::class, 'evenement_id', 'categorie_id');
    }
}
