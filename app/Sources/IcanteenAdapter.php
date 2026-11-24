<?php

namespace App\Sources;

use App\Sources\SourceAdapter;
use RuntimeException;
use Symfony\Component\DomCrawler\Crawler;

class IcanteenAdapter extends SourceAdapter
{

    /**
     * @inheritDoc
     */
    public function key(): string
    {
        return 'icanteen';
    }

    /**
     * @inheritDoc
     */
    public function fetch(): array
    {
        $response = $this->http()
            ->withOptions(['verify' => false])
            ->get('https://obedy.spseiostrava.cz:8443/faces/login.jsp');

        if ($response->failed()) {
            throw new RuntimeException("iCanteen vrátil HTTP chybu: {$response->status()}");
        }

        $crawler = new Crawler($response->body());

        $days = $crawler->filter('.jidelnicekDen')->each(function (Crawler $node) {
            return [
                'day' => $node->filter('div.jidelnicekTop')->text(''),
                'types' => $node->filter('div.shrinkedColumn span')->each(function (Crawler $span) {
                    return $span->text();
                }),
                'meals' => $node->filter('div.column.jidelnicekItem')->each(function (Crawler $meal) {
                    return $meal->text();
                }),
            ];
        });

        if (empty($days)) {
            throw new RuntimeException('Nepodařilo se vyparsovat jídelníček (prázdný výsledek).');
        }

        return $days;
    }
}
