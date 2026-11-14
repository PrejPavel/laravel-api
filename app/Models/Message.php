<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Message extends Model
{
    protected $fillable = [
        'name',
        'body',
        'valid_from',
        'valid_to',
        'priority',
    ];

    public function screens() : BelongsToMany {
        return $this->belongsToMany(Message::class, "message_screen", "message_id", "screen_id");
    }

    protected function casts(): array
    {
        return [
            'valid_from' => 'datetime',
            'valid_to' => 'datetime',
        ];
    }
}
