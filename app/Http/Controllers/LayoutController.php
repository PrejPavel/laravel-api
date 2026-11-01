<?php

namespace App\Http\Controllers;

use App\Models\Layout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LayoutController extends Controller
{
    //
    public function show($layout_id): JsonResponse {
        $layout = Layout::findOrFail($layout_id);

        return response()->json($layout);
    }

    public function update(Request $request, $layout_id): JsonResponse {
        $layout = Layout::findOrFail($layout_id);
        //required je že to musí být jinak nic a sometimes je že když to je tak se to změní taky
        $validated = $request->validate(["grid_json" => "required|array", "name" => "sometimes|string"]);

        $layout->update($validated);

        return response()->json($layout);
    }
}
