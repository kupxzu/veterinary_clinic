<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        $adminEmail = 'admin@vetclinic.com';
        $adminUsername = 'admin';

        // Check if admin already exists
        $existingAdmin = User::where('email', $adminEmail)
                            ->orWhere('username', $adminUsername)
                            ->first();

        if (!$existingAdmin) {
            User::create([
                'name' => 'Admin User',
                'email' => $adminEmail,
                'username' => $adminUsername,
                'password' => Hash::make('admin123'), // Change this password in production
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: ' . $adminEmail);
            $this->command->info('Username: ' . $adminUsername);
            $this->command->info('Password: admin123');
        } else {
            $this->command->info('Admin user already exists!');
        }

        // Create additional admin users for testing
        $additionalAdmins = [
            [
                'name' => 'Dr. John Smith',
                'email' => 'drsmith@vetclinic.com',
                'username' => 'drsmith',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'drjohnson@vetclinic.com',
                'username' => 'drjohnson',
                'password' => Hash::make('password123'),
            ]
        ];

        foreach ($additionalAdmins as $adminData) {
            $existingUser = User::where('email', $adminData['email'])
                               ->orWhere('username', $adminData['username'])
                               ->first();

            if (!$existingUser) {
                User::create([
                    'name' => $adminData['name'],
                    'email' => $adminData['email'],
                    'username' => $adminData['username'],
                    'password' => $adminData['password'],
                    'email_verified_at' => now(),
                ]);

                $this->command->info('Created admin: ' . $adminData['name']);
            }
        }
    }
}
