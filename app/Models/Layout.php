<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layout extends Model
{
    //
    protected $fillable = ["name","grid_json"];
    protected $casts = [
        "grid_json" => "json"
    ];
}
