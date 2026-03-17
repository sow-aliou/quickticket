<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LieuController;
use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\SettingController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public read-only access to events and venues
Route::get('evenements', [EvenementController::class, 'index']);
Route::get('evenements/{evenement}', [EvenementController::class, 'show']);
Route::apiResource('lieux', LieuController::class)->only(['index', 'show']);

// Authenticated user routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('commandes', CommandeController::class);
});

// Admin-only routes (auth + admin role)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('admin/evenements', [EvenementController::class, 'adminIndex']);
    Route::post('evenements', [EvenementController::class, 'store']);
    Route::put('evenements/{evenement}', [EvenementController::class, 'update']);
    Route::patch('evenements/{evenement}', [EvenementController::class, 'update']);
    Route::delete('evenements/{evenement}', [EvenementController::class, 'destroy']);
    Route::apiResource('lieux', LieuController::class)->except(['index', 'show']);
    
    // New Admin Routes
    Route::get('users', [UserController::class, 'index']);
    Route::get('stats', [StatsController::class, 'index']);
    Route::post('settings/batch', [SettingController::class, 'updateBatch']);
});

// Settings public access
Route::get('settings', [SettingController::class, 'index']);
