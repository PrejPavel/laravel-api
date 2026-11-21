<?php

namespace App\Console\Commands;

use App\Models\Source;
use App\Sources\SourceAdapter;
use Illuminate\Console\Command;
use Throwable;

class FetchSourcesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sources:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Downloads data from fetch to db table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //TODO: pochopit toto
        $adapterClasses = config('sources', []);

        foreach ($adapterClasses as $adapterClass) {
            /** @var SourceAdapter $adapter */
            $adapter = app($adapterClass);
            $key = $adapter->key();

            try {
                $data = $adapter->fetch();

                Source::updateOrCreate(
                    ['key' => $key],
                    [
                        'payload' => $data,
                        'fetched_at' => now(),
                        'error' => null,
                    ]
                );

                $this->info("[OK] Zdroj '{$key}' byl úspěšně aktualizován.");
            } catch (Throwable $e) {
                // Zachováme existující payload i fetched_at, zapíšeme jen chybu
                $source = Source::firstOrNew(['key' => $key]);
                $source->error = $e->getMessage();
                $source->save();

                $this->error("[CHYBA] Zdroj '{$key}': {$e->getMessage()}");
            }
        }

        return self::SUCCESS;
    }
}
