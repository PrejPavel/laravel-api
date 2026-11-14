<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Screen extends Model
{
    //
    protected $fillable = ["name", "token","layout_id"];

    //ziska layout od toho screena
    public function layout() : BelongsTo {
        //kdybychom nemeli layout_id pojmenovane layout_id, tak za jako druhy parametr je ten klič cizí
        return $this->belongsTo(Layout::class);
    }

    public function messages() : BelongsToMany {
        return $this->belongsToMany(Message::class, "message_screen", "screen_id", "message_id");
    }
}
