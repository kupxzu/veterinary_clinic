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
        $vaccinations = VaccinationSchedule::with(['pets.clients'])->orderBy('date', 'desc')->get();
        return response()->json($vaccinations);
    }

    /**
     * Get today's vaccination schedules with client information
     */
    public function getTodaysSchedules()
    {
        // Use Carbon to get today's date in the application timezone
        $today = \Carbon\Carbon::today()->format('Y-m-d');
        
        $vaccinations = VaccinationSchedule::with(['pets.clients'])
            ->whereDate('date', $today)
            ->orderBy('date', 'asc')
            ->get();
            
        // Transform data to include client information
        $schedules = $vaccinations->map(function ($vaccination) {
            $pets = $vaccination->pets->map(function ($pet) {
                $clients = $pet->clients->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'fullname' => $client->fullname,
                        'email' => $client->email,
                        'number' => $client->number
                    ];
                });
                
                return [
                    'id' => $pet->id,
                    'name' => $pet->name,
                    'role' => $pet->role,
                    'breed' => $pet->breed,
                    'clients' => $clients
                ];
            });
            
            return [
                'id' => $vaccination->id,
                'date' => $vaccination->date,
                'weight_killogram' => $vaccination->weight_killogram,
                'temperature' => $vaccination->temperature,
                'complain_diagnosis' => $vaccination->complain_diagnosis,
                'treatment' => $vaccination->treatment,
                'service' => $vaccination->service,
                'service_name' => $vaccination->service_name,
                'follow_up' => $vaccination->follow_up,
                'status' => $vaccination->status,
                'status_name' => $vaccination->status_name,
                'pets' => $pets
            ];
        });
        
        return response()->json($schedules);
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
            'complain_diagnosis' => 'required|string|max:255',
            'treatment' => 'required|string|max:255',
            'service' => 'required|in:cbc_test,groom,parasite_treatment,vaccination,surgery,prescription',
            'follow_up' => 'nullable|date|after:date',
            'status' => 'nullable|in:pending,completed,cancelled,in_progress',
            'pet_ids' => 'array', // Optional array of pet IDs
            'pet_ids.*' => 'exists:pets,id'
        ]);

        // Set default values
        $validated['service'] = $validated['service'] ?? 'vaccination';
        $validated['status'] = $validated['status'] ?? 'pending';

        $vaccination = VaccinationSchedule::create([
            'date' => $validated['date'],
            'weight_killogram' => $validated['weight_killogram'],
            'temperature' => $validated['temperature'],
            'complain_diagnosis' => $validated['complain_diagnosis'],
            'treatment' => $validated['treatment'],
            'service' => $validated['service'],
            'follow_up' => $validated['follow_up'] ?? null,
            'status' => $validated['status']
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
            'complain_diagnosis' => 'sometimes|string|max:255',
            'treatment' => 'sometimes|string|max:255',
            'service' => 'sometimes|in:cbc_test,groom,parasite_treatment,vaccination,surgery,prescription',
            'follow_up' => 'nullable|date|after:date',
            'status' => 'sometimes|in:pending,completed,cancelled,in_progress',
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

    /**
     * Get all available service types
     */
    public function getServiceTypes()
    {
        return response()->json(VaccinationSchedule::getServiceTypes());
    }

    /**
     * Get all available status options
     */
    public function getStatusOptions()
    {
        return response()->json(VaccinationSchedule::getStatusOptions());
    }

    /**
     * Get schedules by service type
     */
    public function getByService(string $serviceType)
    {
        $vaccinations = VaccinationSchedule::with(['pets.clients'])
            ->where('service', $serviceType)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($vaccinations);
    }

    /**
     * Get schedules by status
     */
    public function getByStatus(string $status)
    {
        $vaccinations = VaccinationSchedule::with(['pets.clients'])
            ->where('status', $status)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($vaccinations);
    }

    /**
     * Get upcoming follow-ups
     */
    public function getUpcomingFollowUps()
    {
        $followUps = VaccinationSchedule::with(['pets.clients'])
            ->whereNotNull('follow_up')
            ->where('follow_up', '>=', now())
            ->orderBy('follow_up', 'asc')
            ->get();

        return response()->json($followUps);
    }

    /**
     * Mark schedule as completed
     */
    public function markCompleted(string $id)
    {
        $vaccination = VaccinationSchedule::findOrFail($id);
        $vaccination->update(['status' => VaccinationSchedule::STATUS_COMPLETED]);

        return response()->json([
            'message' => 'Schedule marked as completed',
            'vaccination' => $vaccination->load('pets')
        ]);
    }

    /**
     * Mark schedule as cancelled
     */
    public function markCancelled(string $id)
    {
        $vaccination = VaccinationSchedule::findOrFail($id);
        $vaccination->update(['status' => VaccinationSchedule::STATUS_CANCELLED]);

        return response()->json([
            'message' => 'Schedule marked as cancelled',
            'vaccination' => $vaccination->load('pets')
        ]);
    }
}