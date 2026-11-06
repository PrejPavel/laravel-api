<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Screen extends Model
{
    //
    protected $fillable = ["name", "token","layout_id"];

    //ziska layout od toho screena
    public function layout() : BelongsTo {
        //kdybychom nemeli layout_id pojmenovane layout_id, tak za jako druhy parametr je ten klič cizí
        return $this->belongsTo(Layout::class);
    }
}
