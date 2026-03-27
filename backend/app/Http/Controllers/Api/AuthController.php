<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

use App\Mail\ResetPasswordCode;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('react_app')->plainTextToken
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('react_app')->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    /**
     * Demande de réinitialisation de mot de passe.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'Cette adresse email n\'est pas enregistrée dans notre système.'
        ]);

        // Générer un code à 6 chiffres
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($code),
                'created_at' => now()
            ]
        );

        // Envoyer l'email
        Mail::to($request->email)->send(new ResetPasswordCode($code));

        return response()->json([
            'message' => 'Un code de réinitialisation a été envoyé à votre adresse email.',
            'debug_code' => $code // À retirer en production réelle
        ]);
    }

    /**
     * Réinitialisation effective du mot de passe.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.exists' => 'Cette adresse email n\'est pas reconnue.',
            'code.required' => 'Le code est requis.',
            'code.size' => 'Le code doit contenir exactement 6 chiffres.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'password.min' => 'Le mot de passe doit faire au moins 8 caractères.'
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // Vérifier si le code est valide
        if (!$reset || !Hash::check($request->code, $reset->token)) {
            throw ValidationException::withMessages([
                'code' => ['Le code de réinitialisation est invalide.'],
            ]);
        }

        // Vérifier si le code n'a pas expiré (ex: 60 minutes)
        if (now()->parse($reset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            throw ValidationException::withMessages([
                'code' => ['Le code de réinitialisation a expiré.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Utilisateur non trouvé.'],
            ]);
        }
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé avec succès.']);
    }
}
