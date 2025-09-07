<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\VaccinationSchedule;
use App\Models\Pet;

class CheckVaccinations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:vaccinations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check vaccination schedules in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking vaccination schedules...');
        
        $schedules = VaccinationSchedule::with('pets')->get();
        $this->info('Total vaccination schedules: ' . $schedules->count());
        
        foreach ($schedules as $schedule) {
            $this->line("ID: {$schedule->id} | Date: {$schedule->date} | Against: {$schedule->against}");
            if ($schedule->pets->count() > 0) {
                foreach ($schedule->pets as $pet) {
                    $this->line("  - Pet: {$pet->name} (ID: {$pet->id})");
                }
            } else {
                $this->line("  - No pets attached");
            }
        }
        
        $this->info('Checking pets...');
        $pets = Pet::with('vaccinationSchedules')->get();
        
        foreach ($pets as $pet) {
            $this->line("Pet: {$pet->name} (ID: {$pet->id}) | Vaccinations: {$pet->vaccinationSchedules->count()}");
        }
        
        return 0;
    }
}
