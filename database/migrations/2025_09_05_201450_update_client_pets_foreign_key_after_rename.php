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
        // Drop the old foreign key constraint
        Schema::table('client_pets', function (Blueprint $table) {
            $table->dropForeign(['pet_id']);
        });
        
        // Add new foreign key constraint referencing pets table
        Schema::table('client_pets', function (Blueprint $table) {
            $table->foreign('pet_id')->references('id')->on('pets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new foreign key constraint
        Schema::table('client_pets', function (Blueprint $table) {
            $table->dropForeign(['pet_id']);
        });
        
        // Add back old foreign key constraint referencing vet_pet table
        Schema::table('client_pets', function (Blueprint $table) {
            $table->foreign('pet_id')->references('id')->on('vet_pet')->onDelete('cascade');
        });
    }
};
