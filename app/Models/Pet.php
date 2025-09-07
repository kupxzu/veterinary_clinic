<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory;

    protected $table = 'pets';

    protected $fillable = [
        'name',
        'role',
        'breed',
        'species',
        'colormarking',
        'birthday',
        'gender'
    ];

    /**
     * The clients that own the pet.
     */
    public function clients()
    {
        return $this->belongsToMany(\App\Models\Client::class, 'client_pets');
    }

    /**
     * The vaccination schedules for the pet.
     */
    public function vaccinationSchedules()
    {
        return $this->belongsToMany(VaccinationSchedule::class, 'vac_pet', 'petid', 'vac_schedid');
    }
}
