<?php


namespace App\Http\Controllers;


use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Symfony\Component\DomCrawler\Crawler;


class icanteenData extends Controller
{
    //
    public function scrape(): JsonResponse
    {
        $url = Http::get("https://obedy.spseiostrava.cz:8443/faces/login.jsp");
        $crawler = new Crawler($url);


        $days = $crawler->filter('.jidelnicekDen')->each(function (Crawler $node, $i) {
            return [
                "day" => $node->filter('div.jidelnicekTop')->text(),
                "types" => $node->filter('div.shrinkedColumn span')->each(function (Crawler $node, $i) {
                    return $node->text();
                }),
                "meals" => $node->filter('div.column.jidelnicekItem')->each(function (Crawler $node, $i) {
                    return $node->text();
                }),
                // for na day a for na types+meals ve vypisu
                // data[0].day
                // data[0].types[0]
                // data[0].meals[0]
                // data[0].types[1]
                // data[0].meals[1]
                // data[1].day
                // data[1].types[0]
                // data[1].meals[0]
                // data[1].types[1]
                // data[1].meals[1]
            ];
        });
        return response()->json($days);  //returns all as json array

    }
}
