<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $message = Message::updateOrCreate(["id" => 1],[
            'name' => 'Testovací message',
            "body" => "MESSAGE BODY",
            "valid_from" => "2026-11-14T07:00:00.000000Z",
            "valid_to" => "2026-11-14T08:00:00.000000Z",
            "priority" => 1
        ]);
        $message->screens()->sync([1]);
    }
}
