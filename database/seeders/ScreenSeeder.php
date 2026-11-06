<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Screen;

class ScreenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Screen::updateOrCreate([
            "id" => 1
        ], [
           "name" => "test screen",
            //"description" => "test screen",
            "token" => "test screen",
            "layout_id" => 1
        ]);
    }
}
