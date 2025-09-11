<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Models\VaccinationSchedule;
use App\Models\Pet;
use App\Models\Client;

// Set up database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'vet_clinic'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    echo "Creating test vaccination schedule for today...\n";
    
    // Get current date and time
    $today = now();
    $todayDate = $today->format('Y-m-d H:i:s');
    
    echo "Today's date: $todayDate\n";
    
    // Create a vaccination schedule for today
    $vaccination = VaccinationSchedule::create([
        'date' => $todayDate,
        'weight_killogram' => 5.50,
        'temperature' => 38.2,
        'complain_diagnosis' => 'Routine checkup and vaccination',
        'treatment' => 'Annual vaccination and health check'
    ]);
    
    echo "Created vaccination schedule with ID: " . $vaccination->id . "\n";
    
    // Get the first pet and attach it to this vaccination
    $pet = Pet::first();
    if ($pet) {
        $vaccination->pets()->attach($pet->id);
        echo "Attached pet: " . $pet->name . " to vaccination schedule\n";
    }
    
    // Test the new API endpoint functionality
    echo "\nTesting today's schedules endpoint...\n";
    $todaysSchedules = VaccinationSchedule::with(['pets.clients'])
        ->whereDate('date', $today->format('Y-m-d'))
        ->orderBy('date', 'asc')
        ->get();
    
    echo "Found " . $todaysSchedules->count() . " schedules for today\n";
    
    foreach ($todaysSchedules as $schedule) {
        echo "Schedule ID: " . $schedule->id . "\n";
        echo "Date: " . $schedule->date . "\n";
        echo "Diagnosis: " . $schedule->complain_diagnosis . "\n";
        
        foreach ($schedule->pets as $pet) {
            echo "  Pet: " . $pet->name . " (" . $pet->breed . ")\n";
            foreach ($pet->clients as $client) {
                echo "    Client: " . $client->fullname . " - " . $client->email . " - " . $client->number . "\n";
            }
        }
        echo "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
