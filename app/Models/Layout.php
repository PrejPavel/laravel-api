<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layout extends Model
{
    //
    protected $fillable = ["name","grid_json"];
    protected $casts = [
        "grid_json" => "json"
    ];
    public function screens() : HasMany {
        return $this->hasMany(Screen::class);
    }
}
