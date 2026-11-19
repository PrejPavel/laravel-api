<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    protected $fillable = [
        'key',
        'payload',
        'fetched_at',
        'error',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'fetched_at' => 'timestamp',
        ];
    }
}
