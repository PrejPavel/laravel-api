<?php

namespace App\Sources;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Throwable;

abstract class SourceAdapter
{
    /**
     * Unikátní klíč zdroje, pod kterým se data uloží do tabulky `sources` (např. 'icanteen').
     */
    abstract public function key(): string;

    /**
     * Stáhne a naparsuje data ze zdroje do jednotného pole.
     * Při jakékoli chybě (síť, HTTP status, neplatná struktura) musí vyhodit výjimku.
     *
     * @return array<string, mixed>
     * @throws Throwable
     */
    abstract public function fetch(): array;

    /**
     * Sdílený HTTP klient s rozumným timeoutem, aby jeden pomalý web nezablokoval celý Scheduler.
     */
    protected function http(): PendingRequest
    {
        return Http::timeout(10)->connectTimeout(5);
    }
}
