<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClientPetsController extends Controller
{
    /**
     * Display a listing of all clients with their pets.
     */
    public function index()
    {
        try {
            return Client::with('pets')->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch clients'], 500);
        }
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullname' => 'required|string|max:255',
                'address' => 'required|string',
                'age' => 'nullable|integer|min:1|max:120',
                'email' => 'required|email|unique:clients',
                'number' => 'required|string'
            ]);

            $client = Client::create($validated);
            return response()->json($client, 201);
        } catch (\Exception $e) {
            Log::error('Client creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create client: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified client with pets.
     */
    public function show(string $id)
    {
        try {
            return Client::with('pets')->findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Client not found'], 404);
        }
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, string $id)
    {
        try {
            $client = Client::findOrFail($id);

            $validated = $request->validate([
                'fullname' => 'required|string|max:255',
                'address' => 'required|string',
                'age' => 'required|integer|min:1|max:120',
                'email' => 'required|email|unique:clients,email,' . $id,
                'number' => 'required|string'
            ]);

            $client->update($validated);
            return response()->json($client);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update client'], 500);
        }
    }

    /**
     * Remove the specified client.
     */
    public function destroy(string $id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();
            return response()->json(['message' => 'Client deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete client'], 500);
        }
    }

    /**
     * Assign a pet to a client.
     */
    public function assignPet(Request $request, string $clientId)
    {
        try {
            $validated = $request->validate([
                'pet_id' => 'required|exists:pets,id'
            ]);

            $client = Client::findOrFail($clientId);
            $pet = Pet::findOrFail($validated['pet_id']);

            // Check if relationship already exists
            if (!$client->pets()->where('pet_id', $pet->id)->exists()) {
                $client->pets()->attach($pet->id);
            }

            return response()->json(['message' => 'Pet assigned to client successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign pet to client'], 500);
        }
    }

    /**
     * Remove a pet from a client.
     */
    public function removePet(string $clientId, string $petId)
    {
        try {
            $client = Client::findOrFail($clientId);
            $client->pets()->detach($petId);

            return response()->json(['message' => 'Pet removed from client successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to remove pet from client'], 500);
        }
    }
}
