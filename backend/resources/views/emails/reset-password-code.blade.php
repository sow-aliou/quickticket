<x-mail::message>
# Bonjour,

Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.

Votre code de réinitialisation est : **{{ $code }}**

Ce code expirera dans 60 minutes.

Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune autre action n'est requise.

Merci,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
