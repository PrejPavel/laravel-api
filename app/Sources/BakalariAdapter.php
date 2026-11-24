<?php

namespace App\Sources;

use http\Exception\RuntimeException;
use Carbon\Carbon;

//TODO: ošetření

class BakalariAdapter extends SourceAdapter
{

    public function key(): string
    {
        return 'bakalari';
    }

    public function fetch(): array
    {
        $date = Carbon::today()->format("Ymd");

        $url = "https://znamky.spseiostrava.cz/if/2/substitutions/public/$date";
        $uzivatel = config("services.bakalari.username");
        $heslo = config("services.bakalari.password");

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_USERPWD, "$uzivatel:$heslo");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

        $odpoved = curl_exec($ch);
        curl_close ($ch);

        if ($odpoved === false) {
            throw new RuntimeException("nepovedlo se sehnat data z bakalařku bo sem dostal false z curl");
        }
        return json_decode($odpoved, true);
    }
}
