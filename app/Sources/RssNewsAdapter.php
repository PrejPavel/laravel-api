<?php

namespace App\Sources;

use App\Sources\SourceAdapter;
use Carbon\Carbon;
use Illuminate\Support\Str;

class RssNewsAdapter extends SourceAdapter
{

    /**
     * @inheritDoc
     */
    public function key(): string
    {
        return "news";
    }

    /**
     * @inheritDoc
     */
    //TODO: think about the limit and how it should work
    public function fetch(): array
    {
        $url = 'https://www.spseiostrava.cz/cs/aktuality?format=feed&type=rss';
        $reponse = $this->http()->get($url);
        $items = [];
        if ($reponse->getStatusCode() == 200) {
            $xml = simplexml_load_string($reponse->getBody());
            foreach ($xml->channel->item as $item) {
                $categories = [];
                foreach ($item->category as $category) {
                    $cat = trim((string) $category);
                    if ($cat !== ""){
                        $categories[] = $cat;
                    }
                }
                $html = (string) $item->description;
                $clean_html = html_entity_decode(strip_tags($html, '<p><br><strong><b><em><i><ul><ol><li>'), ENT_QUOTES, 'UTF-8');
                $clean_html = preg_replace('/[^\S \n]+/', '', $clean_html);

                $pubDate = trim((string) $item->pubDate);
                $formattedDate = Carbon::parse($pubDate)->format('d .m .y');

                $items[] = [
                    "title" => trim((string) $item->title),
                    "link" => trim((string) $item->link),
                    //INFO: didn't ended up liking the limit, subject to change
                    //"description" => Str::limit($clean_html, 480),
                    "description" => $clean_html,
                    "pubDate" => $formattedDate,
                    "categories" => $categories,
                ];
            }

        }
        return $items;
    }
}
