<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the settings.
     */
    public function index()
    {
        return response()->json(Setting::all());
    }

    /**
     * Update the specified setting.
     */
    public function update(Request $request, Setting $setting)
    {
        $request->validate([
            'value' => 'nullable'
        ]);

        $setting->update([
            'value' => $request->value
        ]);

        return response()->json($setting);
    }
    
    /**
     * Update multiple settings at once.
     */
    public function updateBatch(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|exists:settings,key',
            'settings.*.value' => 'nullable'
        ]);

        foreach ($request->settings as $item) {
            Setting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json(['message' => 'Paramètres mis à jour']);
    }
}
