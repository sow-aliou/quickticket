<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Log::info('Paiement : Initialisation', ['amount' => $request->amount]);

        $request->validate([
            'items' => 'required|array',
            'amount' => 'required|numeric'
        ]);

        try {
            $key = env('STRIPE_SECRET_KEY');
            if (!$key) {
                Log::error('Clé Stripe manquante dans le .env');
                return response()->json(['error' => 'Configuration Stripe manquante.'], 500);
            }

            Stripe::setApiKey($key);

            $amountInCents = $request->amount; 

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'xof', 
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            Log::info('Paiement : PaymentIntent créé', ['id' => $paymentIntent->id]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur Stripe fatale: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
