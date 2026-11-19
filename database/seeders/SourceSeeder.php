<?php

namespace Database\Seeders;

use App\Models\Source;
use App\Sources\ICanteenAdapter;
use Illuminate\Database\Seeder;
use Throwable;

class SourceSeeder extends Seeder
{
    public function run(): void
    {
        $adapter = new ICanteenAdapter();

        try {
            $data = $adapter->fetch();

            Source::updateOrCreate(
                ['key' => $adapter->key()],
                [
                    'payload' => $data,
                    'fetched_at' => now(),
                    'error' => null,
                ]
            );
        } catch (Throwable $e) {
            // Záložní testovací data, pokud je iCanteen při seedování nedostupný
            Source::updateOrCreate(
                ['key' => $adapter->key()],
                [
                    'payload' => [
                        [
                            'day' => 'Jídelníček na dnes (ukázková data)',
                            'types' => ['Svačina 1', 'Oběd 1', 'Oběd 2'],
                            'meals' => [
                                'Bageta sýrová 1,7',
                                'Polévka zeleninová, kuřecí plátek, bramborová kaše 1,7',
                                'Polévka zeleninová, těstoviny s omáčkou 1,3,7',
                            ],
                        ],
                    ],
                    'fetched_at' => now(),
                    'error' => 'Seeder fallback: ' . $e->getMessage(),
                ]
            );
        }
    }
}
