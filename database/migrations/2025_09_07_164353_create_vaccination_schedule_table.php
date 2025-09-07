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
        Schema::create('vaccination_schedule', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->decimal('weight_killogram', 5, 2); // up to 999.99 kg
            $table->decimal('temperature', 4, 1); // up to 999.9°C
            $table->string('against'); // what the vaccination is against
            $table->string('manifacturer'); // manufacturer of the vaccine
            $table->string('veterenarian'); // veterinarian who administered
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vaccination_schedule');
    }
};
