<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'fullname' => 'John Smith',
                'address' => '123 Main Street, New York, NY 10001',
                'age' => 35,
                'email' => 'john.smith@email.com',
                'number' => '+1-555-0123'
            ],
            [
                'fullname' => 'Sarah Johnson',
                'address' => '456 Oak Avenue, Los Angeles, CA 90210',
                'age' => 28,
                'email' => 'sarah.johnson@email.com',
                'number' => '+1-555-0456'
            ],
            [
                'fullname' => 'Michael Brown',
                'address' => '789 Pine Road, Chicago, IL 60601',
                'age' => 42,
                'email' => 'michael.brown@email.com',
                'number' => '+1-555-0789'
            ],
            [
                'fullname' => 'Emily Davis',
                'address' => '321 Elm Street, Houston, TX 77001',
                'age' => 31,
                'email' => 'emily.davis@email.com',
                'number' => '+1-555-0321'
            ],
            [
                'fullname' => 'David Wilson',
                'address' => '654 Maple Drive, Phoenix, AZ 85001',
                'age' => 39,
                'email' => 'david.wilson@email.com',
                'number' => '+1-555-0654'
            ]
        ];

        foreach ($clients as $clientData) {
            \App\Models\Client::create($clientData);
        }
    }
}
