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
            
            // Drop 'treatment' column
            $table->dropColumn('treatment');
            
            // Change 'date' column back to date only
            $table->date('date')->change();
            
            // Add back 'manifacturer' and 'veterenarian' columns
            $table->string('manifacturer')->nullable();
            $table->string('veterenarian')->nullable();
        });
    }
};
