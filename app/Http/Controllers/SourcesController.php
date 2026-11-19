<?php

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SourcesController extends Controller
{
    public function index()
    {
        return Source::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'key' => ['required'],
            'payload' => ['nullable'],
            'fetched_at' => ['nullable', 'date'],
            'error' => ['nullable'],
        ]);

        return Source::create($data);
    }

    public function show(string $key): JsonResponse
    {
        $source = Source::where('key', $key)->first();

        if (!$source || $source->payload === null) {
            return response()->json([
                'success' => false,
                'message' => "Zdroj '{$key}' zatím nebyl načten.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'key' => $source->key,
            //TODO: zmenit na datetime asi
            'fetched_at' => $source->fetched_at,
            'error' => $source->error,
            'data' => $source->payload,
        ]);
    }

    public function update(Request $request, Source $sources)
    {
        $data = $request->validate([
            'key' => ['required'],
            'payload' => ['nullable'],
            'fetched_at' => ['nullable', 'date'],
            'error' => ['nullable'],
        ]);

        $sources->update($data);

        return $sources;
    }

    public function destroy(Source $sources)
    {
        $sources->delete();

        return response()->json();
    }
}
