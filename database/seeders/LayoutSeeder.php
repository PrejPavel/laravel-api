<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Layout;

class LayoutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Layout::create([
            'name' => 'Testovací layout',
            'grid_json' => json_decode(file_get_contents(database_path('seeders/layout.json')), true),
        ]);
    }
}
