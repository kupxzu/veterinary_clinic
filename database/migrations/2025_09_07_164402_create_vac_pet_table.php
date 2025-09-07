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
        Schema::create('vac_pet', function (Blueprint $table) {
            $table->id();
            $table->foreignId('petid')->constrained('pets')->onDelete('cascade');
            $table->foreignId('vac_schedid')->constrained('vaccination_schedule')->onDelete('cascade');
            $table->timestamps();
            
            // Ensure unique combination of pet and vaccination schedule
            $table->unique(['petid', 'vac_schedid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vac_pet');
    }
};
