<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Pet;
use Illuminate\Database\Seeder;

class ClientPetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all clients and pets
        $clients = Client::all();
        $pets = Pet::all();

        if ($clients->count() > 0 && $pets->count() > 0) {
            // Assign pets to clients
            $relationships = [
                1 => [1, 2], // John Smith owns Buddy and Luna
                2 => [3],    // Sarah Johnson owns Max
                3 => [4, 5], // Michael Brown owns Bella and Whiskers
                4 => [6],    // Emily Davis owns Charlie
                5 => [7, 8], // David Wilson owns Mittens and Rocky
            ];

            foreach ($relationships as $clientId => $petIds) {
                $client = $clients->find($clientId);
                if ($client) {
                    foreach ($petIds as $petId) {
                        $pet = $pets->find($petId);
                        if ($pet && !$client->pets()->where('pet_id', $pet->id)->exists()) {
                            $client->pets()->attach($pet->id);
                        }
                    }
                }
            }
        }
    }
}
