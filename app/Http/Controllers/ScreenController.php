<?php

namespace App\Http\Controllers;

use App\Models\Layout;
use App\Models\Screen;
use Illuminate\Http\Request;

class ScreenController extends Controller
{
    //
    public function getScreen($token) {
        $screen = Screen::with('layout')->where('token', $token)->firstOrFail();
        if (!$screen->layout) {
            return response()->json([
                'error' => 'NO_LAYOUT',
                'message' => 'Obrazovka nemá přiřazený layout.'
            ], 409);
        }
        return response()->json($screen->layout);
    }
}
