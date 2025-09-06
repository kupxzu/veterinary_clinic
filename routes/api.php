<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ClientPetsController;

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
