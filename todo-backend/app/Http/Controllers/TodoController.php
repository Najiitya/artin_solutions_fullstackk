<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index(Request $request){
        $query = Todo::where('user_id', Auth::id());

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $isCompleted = $request->query('status') === 'completed' ? true : false;
            $query->where('is_completed', $isCompleted);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $todo = Auth::user()->todos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_completed' => false, // Default to pending
        ]);

        return response()->json($todo, 201);
    }

    public function show(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($todo);
    }

    
}
