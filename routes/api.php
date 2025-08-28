<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

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
