<?php

use App\Http\Controllers\ScreenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\icanteenData;
use App\Http\Controllers\LayoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/icanteenData',[icanteenData::class, 'scrape']); //prvni je ta uri /api/icanteenData a pokud tam pujdu zavolam kontroler a metodu v nem
Route::get("layouts/{id}", [LayoutController::class, 'show']);
Route::get("player/{token}", [ScreenController::class, 'getScreen'] );
Route::put("layouts/{id}", [LayoutController::class, 'update']);
