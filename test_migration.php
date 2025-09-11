<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\VaccinationSchedule;

try {
    // Test if we can access the new columns
    $schedule = new VaccinationSchedule();
    
    echo "Testing VaccinationSchedule model with new columns:\n";
    echo "Fillable fields: " . implode(', ', $schedule->getFillable()) . "\n";
    
    echo "\nService types:\n";
    foreach (VaccinationSchedule::getServiceTypes() as $key => $value) {
        echo "- $key: $value\n";
    }
    
    echo "\nStatus options:\n";
    foreach (VaccinationSchedule::getStatusOptions() as $key => $value) {
        echo "- $key: $value\n";
    }
    
    // Try to create a test record (but don't save it)
    $testSchedule = new VaccinationSchedule([
        'date' => now(),
        'weight_killogram' => 5.5,
        'temperature' => 38.5,
        'complain_diagnosis' => 'Test diagnosis',
        'treatment' => 'Test treatment',
        'service' => 'vaccination',
        'status' => 'pending'
    ]);
    
    echo "\nTest record created successfully with new fields!\n";
    echo "Service: " . $testSchedule->service . "\n";
    echo "Status: " . $testSchedule->status . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
