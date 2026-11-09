<?php

use Illuminate\Support\Facades\Route;

/*
Route::get('/', function () {
    return view('welcome');
});
*/
Route::view('/', 'admin');
Route::view("/player", "player");
Route::view("/admin", "admin");
