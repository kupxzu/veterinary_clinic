<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ClientPetsController;
use App\Http\Controllers\VaccinationScheduleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Admin routes
Route::prefix('admin')->group(function () {
    // Public admin routes (no authentication required)
    Route::post('/login', [AdminController::class, 'login']);
    
    // Protected admin routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminController::class, 'logout']);
        Route::get('/profile', [AdminController::class, 'profile']);
    });
});

// Pet API CRUD routes (renamed from vet-pet)
Route::apiResource('pets', PetController::class);
Route::get('pets/breeds/options', [PetController::class, 'getBreeds']);
Route::get('pets/species/options', [PetController::class, 'getSpecies']);

// Client and Client-Pet relationship routes
Route::apiResource('clients', ClientPetsController::class);
Route::post('clients/{client}/assign-pet', [ClientPetsController::class, 'assignPet']);
Route::delete('clients/{client}/pets/{pet}', [ClientPetsController::class, 'removePet']);

// Vaccination Schedule routes
Route::apiResource('vaccination-schedules', VaccinationScheduleController::class);
Route::get('vaccination-schedules/todays/schedules', [VaccinationScheduleController::class, 'getTodaysSchedules']);
Route::get('pets/{pet}/vaccinations', [VaccinationScheduleController::class, 'getByPet']);
Route::post('vaccination-schedules/{vaccination}/attach-pet', [VaccinationScheduleController::class, 'attachPet']);
Route::delete('vaccination-schedules/{vaccination}/pets/{pet}', [VaccinationScheduleController::class, 'detachPet']);

// New medical service routes
Route::get('vaccination-schedules/options/services', [VaccinationScheduleController::class, 'getServiceTypes']);
Route::get('vaccination-schedules/options/statuses', [VaccinationScheduleController::class, 'getStatusOptions']);
Route::get('vaccination-schedules/service/{serviceType}', [VaccinationScheduleController::class, 'getByService']);
Route::get('vaccination-schedules/status/{status}', [VaccinationScheduleController::class, 'getByStatus']);
Route::get('vaccination-schedules/follow-ups/upcoming', [VaccinationScheduleController::class, 'getUpcomingFollowUps']);
Route::patch('vaccination-schedules/{id}/mark-completed', [VaccinationScheduleController::class, 'markCompleted']);
Route::patch('vaccination-schedules/{id}/mark-cancelled', [VaccinationScheduleController::class, 'markCancelled']);
