<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VaccinationSchedule extends Model
{
    use HasFactory;

    protected $table = 'vaccination_schedule';

    protected $fillable = [
        'date',
        'weight_killogram',
        'temperature',
        'against',
        'manifacturer',
        'veterenarian'
    ];

    protected $casts = [
        'date' => 'date',
        'weight_killogram' => 'decimal:2',
        'temperature' => 'decimal:1',
    ];

    /**
     * Relationship: VaccinationSchedule belongs to many Pets
     */
    public function pets()
    {
        return $this->belongsToMany(Pet::class, 'vac_pet', 'vac_schedid', 'petid');
    }
}
