<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;

class PetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return Pet::all();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch pets'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'role' => 'required|in:canine,feline',
                'breed' => 'nullable|string|max:255',
                'species' => 'nullable|string|max:255',
                'colormarking' => 'nullable|string',
                'birthday' => 'required|date',
                'gender' => 'required|in:male,female'
            ]);

            $pet = Pet::create($validated);
            return response()->json($pet, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create pet'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            return Pet::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Pet not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $pet = Pet::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'role' => 'required|in:canine,feline',
                'breed' => 'nullable|string|max:255',
                'species' => 'nullable|string|max:255',
                'colormarking' => 'nullable|string',
                'birthday' => 'required|date',
                'gender' => 'required|in:male,female'
            ]);

            $pet->update($validated);
            return response()->json($pet);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update pet'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $pet = Pet::findOrFail($id);
            $pet->delete();
            return response()->json(['message' => 'Pet deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete pet'], 500);
        }
    }

    /**
     * Get breed options based on role
     */
    public function getBreeds(Request $request)
    {
        $role = $request->query('role');
        
        $breeds = [
            'canine' => [
                'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog',
                'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund',
                'Siberian Husky', 'Boxer', 'Border Collie', 'Chihuahua', 'Shih Tzu',
                'Boston Terrier', 'Pomeranian', 'Australian Shepherd', 'Mixed Breed'
            ],
            'feline' => [
                'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Siamese',
                'American Shorthair', 'Abyssinian', 'Russian Blue', 'Scottish Fold',
                'Sphynx', 'Bengal', 'American Curl', 'Birman', 'Oriental Shorthair',
                'Devon Rex', 'Domestic Shorthair', 'Domestic Longhair', 'Mixed Breed'
            ]
        ];

        return response()->json($breeds[$role] ?? []);
    }

    /**
     * Get species options based on role
     */
    public function getSpecies(Request $request)
    {
        $role = $request->query('role');
        
        $species = [
            'canine' => [
                'Domestic Dog', 'Working Dog', 'Toy Dog', 'Terrier', 'Hound',
                'Sporting Dog', 'Non-Sporting Dog', 'Herding Dog'
            ],
            'feline' => [
                'Domestic Cat', 'Longhair Cat', 'Shorthair Cat', 'Hairless Cat',
                'Wild Cat Hybrid'
            ]
        ];

        return response()->json($species[$role] ?? []);
    }
}
