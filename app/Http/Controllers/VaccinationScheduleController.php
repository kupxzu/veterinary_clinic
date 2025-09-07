<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VaccinationSchedule;
use App\Models\Pet;
use Illuminate\Validation\ValidationException;

class VaccinationScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vaccinations = VaccinationSchedule::with('pets')->orderBy('date', 'desc')->get();
        return response()->json($vaccinations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'weight_killogram' => 'required|numeric|min:0|max:999.99',
            'temperature' => 'required|numeric|min:0|max:999.9',
            'against' => 'required|string|max:255',
            'manifacturer' => 'required|string|max:255',
            'veterenarian' => 'required|string|max:255',
            'pet_ids' => 'array', // Optional array of pet IDs
            'pet_ids.*' => 'exists:pets,id'
        ]);

        $vaccination = VaccinationSchedule::create([
            'date' => $validated['date'],
            'weight_killogram' => $validated['weight_killogram'],
            'temperature' => $validated['temperature'],
            'against' => $validated['against'],
            'manifacturer' => $validated['manifacturer'],
            'veterenarian' => $validated['veterenarian']
        ]);

        // Attach pets if provided
        if (isset($validated['pet_ids'])) {
            $vaccination->pets()->attach($validated['pet_ids']);
        }

        return response()->json($vaccination->load('pets'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $vaccination = VaccinationSchedule::with('pets')->findOrFail($id);
        return response()->json($vaccination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $vaccination = VaccinationSchedule::findOrFail($id);

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'weight_killogram' => 'sometimes|numeric|min:0|max:999.99',
            'temperature' => 'sometimes|numeric|min:0|max:999.9',
            'against' => 'sometimes|string|max:255',
            'manifacturer' => 'sometimes|string|max:255',
            'veterenarian' => 'sometimes|string|max:255',
            'pet_ids' => 'sometimes|array',
            'pet_ids.*' => 'exists:pets,id'
        ]);

        $vaccination->update($validated);

        // Update pet relationships if provided
        if (isset($validated['pet_ids'])) {
            $vaccination->pets()->sync($validated['pet_ids']);
        }

        return response()->json($vaccination->load('pets'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $vaccination = VaccinationSchedule::findOrFail($id);
        $vaccination->delete();
        return response()->json(['message' => 'Vaccination schedule deleted successfully']);
    }

    /**
     * Get vaccinations for a specific pet
     */
    public function getByPet(Pet $pet)
    {
        $vaccinations = $pet->vaccinationSchedules()->orderBy('date', 'desc')->get();
        return response()->json($vaccinations);
    }

    /**
     * Attach a pet to a vaccination schedule
     */
    public function attachPet(Request $request, string $vaccinationId)
    {
        $vaccination = VaccinationSchedule::findOrFail($vaccinationId);
        
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id'
        ]);

        $vaccination->pets()->attach($validated['pet_id']);
        
        return response()->json([
            'message' => 'Pet attached to vaccination schedule successfully',
            'vaccination' => $vaccination->load('pets')
        ]);
    }

    /**
     * Detach a pet from a vaccination schedule
     */
    public function detachPet(string $vaccinationId, string $petId)
    {
        $vaccination = VaccinationSchedule::findOrFail($vaccinationId);
        $vaccination->pets()->detach($petId);
        
        return response()->json([
            'message' => 'Pet detached from vaccination schedule successfully',
            'vaccination' => $vaccination->load('pets')
        ]);
    }
}