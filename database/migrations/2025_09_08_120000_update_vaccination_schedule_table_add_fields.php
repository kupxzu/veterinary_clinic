<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vaccination_schedule', function (Blueprint $table) {
            // Rename 'against' column to 'complain_diagnosis'
            $table->renameColumn('against', 'complain_diagnosis');
            
            // Add new 'treatment' column
            $table->string('treatment')->after('complain_diagnosis');
            
            // Add service type column with enum values
            $table->enum('service', [
                'cbc_test',
                'groom', 
                'parasite_treatment',
                'vaccination',
                'surgery',
                'prescription'
            ])->default('vaccination')->after('treatment');
            
            // Add follow_up column for follow-up schedules
            $table->datetime('follow_up')->nullable()->after('service');
            
            // Add status column
            $table->enum('status', [
                'pending',
                'completed',
                'cancelled',
                'in_progress'
            ])->default('pending')->after('follow_up');
            
            // Change 'date' column to datetime to include time
            $table->datetime('date')->change();
            
            // Remove 'manifacturer' and 'veterenarian' columns
            $table->dropColumn(['manifacturer', 'veterenarian']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vaccination_schedule', function (Blueprint $table) {
            // Revert 'complain_diagnosis' back to 'against'
            $table->renameColumn('complain_diagnosis', 'against');
            
            // Drop new columns
            $table->dropColumn(['treatment', 'service', 'follow_up', 'status']);
            
            // Change 'date' column back to date only
            $table->date('date')->change();
            
            // Add back 'manifacturer' and 'veterenarian' columns
            $table->string('manifacturer')->nullable();
            $table->string('veterenarian')->nullable();
        });
    }
};
