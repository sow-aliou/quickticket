<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the users for admin.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->latest()
            ->get();
            
        return response()->json([
            'data' => $users,
            'total' => $users->count()
        ]);
    }
}
