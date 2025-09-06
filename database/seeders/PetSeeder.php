<?php

namespace Database\Seeders;

use App\Models\Pet;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pets = [
            [
                'name' => 'Buddy',
                'role' => 'canine',
                'birthday' => Carbon::now()->subYears(3)->format('Y-m-d'),
                'gender' => 'male'
            ],
            [
                'name' => 'Luna',
                'role' => 'feline',
                'birthday' => Carbon::now()->subYears(2)->format('Y-m-d'),
                'gender' => 'female'
            ],
            [
                'name' => 'Max',
                'role' => 'canine',
                'birthday' => Carbon::now()->subYears(5)->format('Y-m-d'),
                'gender' => 'male'
            ],
            [
                'name' => 'Bella',
                'role' => 'canine',
                'birthday' => Carbon::now()->subYears(1)->format('Y-m-d'),
                'gender' => 'female'
            ],
            [
                'name' => 'Whiskers',
                'role' => 'feline',
                'birthday' => Carbon::now()->subYears(4)->format('Y-m-d'),
                'gender' => 'male'
            ],
            [
                'name' => 'Charlie',
                'role' => 'canine',
                'birthday' => Carbon::now()->subMonths(8)->format('Y-m-d'),
                'gender' => 'male'
            ],
            [
                'name' => 'Mittens',
                'role' => 'feline',
                'birthday' => Carbon::now()->subYears(6)->format('Y-m-d'),
                'gender' => 'female'
            ],
            [
                'name' => 'Rocky',
                'role' => 'canine',
                'birthday' => Carbon::now()->subYears(7)->format('Y-m-d'),
                'gender' => 'male'
            ]
        ];

        foreach ($pets as $petData) {
            Pet::create($petData);
        }
    }
}
