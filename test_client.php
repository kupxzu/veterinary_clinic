<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Client;

try {
    echo "Testing Client model...\n";
    $count = Client::count();
    echo "Client count: $count\n";
    
    $clients = Client::all();
    echo "Clients found: " . json_encode($clients->toArray()) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
