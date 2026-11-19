<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ScreenController;
use App\Http\Controllers\SourcesController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\icanteenData;
use App\Http\Controllers\LayoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/icanteenData',[icanteenData::class, 'scrape']); //prvni je ta uri /api/icanteenData a pokud tam pujdu zavolam kontroler a metodu v nem
Route::apiResource("screens", ScreenController::class);
Route::get("player/{token}", [ScreenController::class, 'getScreen'] );
//layouts
Route::get("layouts/{id}", [LayoutController::class, 'show']);
Route::put("layouts/{id}", [LayoutController::class, 'update']);
//messages
Route::apiResource("messages", MessageController::class);
Route::get("player/{token}/messages", [MessageController::class, 'getMessages']);

//sources
Route::apiResource("sources", SourcesController::class);
Route::get('/sources/{key}', [SourceController::class, 'show']);
Route::get('/videos/{filename}', [VideoController::class, 'show']);

