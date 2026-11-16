<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class VideoController extends Controller
{
    public function show(string $filename): BinaryFileResponse
    {
        $filename = basename($filename);
        $path = Storage::disk('local')->path("videos/{$filename}");

        abort_unless(file_exists($path), 404);

        return response()->file($path, [
            'Content-Type' => 'video/mp4',
            'Cache-Control' => 'public, max-age=86400', // Cache for 24 hours
        ]);
    }
}
