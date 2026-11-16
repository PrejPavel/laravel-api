<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with("screens:id,name")->orderByDesc("priority")->get();
        return response()->json($messages);
    }
    public function show($message_id): JsonResponse {
        $message = Message::findOrFail($message_id);
        return response()->json($message);
    }
    public function store(Request $request) {
        $validated = $this->validateMessage($request);
        $message = Message::create($validated);
        $message->screens()->sync($validated["screen_ids"]);

        return response()->json($message->load("screens:id,name"),201);
    }

    public function update(Request $request, Message $message) {
        $validated = $this->validateMessage($request);
        $message->update($validated);
        $message->screens()->sync($validated["screen_ids"]);

        return response()->json($message->load("screens:id,name"));
    }

    public function destroy(Message $message) {
        $message->screens()->detach();
        $message->delete();
        return response()->noContent();
    }

    private function validateMessage(Request $request) {
        return $request->validate([
            "name" => ["required", "string", "max:255"],
            "body" => ["required", "string"],
            "valid_from" => ["required", "date"],
            "valid_to" => ["required", "after_or_equal:valid_from"],
            "priority" => ["required", "integer", "between:0,2"],
            "screen_ids" => ["required", "array", "min:1"],
            "screen_ids.*" => ["required", "integer", "exists:screens,id"],
        ]);
    }
}
