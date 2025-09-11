<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VaccinationSchedule extends Model
{
    use HasFactory;

    protected $table = 'vaccination_schedule';

    // Service types constants
    const SERVICE_CBC_TEST = 'cbc_test';
    const SERVICE_GROOM = 'groom';
    const SERVICE_PARASITE_TREATMENT = 'parasite_treatment';
    const SERVICE_VACCINATION = 'vaccination';
    const SERVICE_SURGERY = 'surgery';
    const SERVICE_PRESCRIPTION = 'prescription';

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_IN_PROGRESS = 'in_progress';

    protected $fillable = [
        'date',
        'weight_killogram',
        'temperature',
        'complain_diagnosis',
        'treatment',
        'service',
        'follow_up',
        'status'
    ];

    protected $casts = [
        'date' => 'datetime',
        'follow_up' => 'datetime',
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

    /**
     * Get all available service types
     */
    public static function getServiceTypes()
    {
        return [
            self::SERVICE_CBC_TEST => 'CBC Test',
            self::SERVICE_GROOM => 'Grooming',
            self::SERVICE_PARASITE_TREATMENT => 'Parasite Treatment',
            self::SERVICE_VACCINATION => 'Vaccination',
            self::SERVICE_SURGERY => 'Surgery',
            self::SERVICE_PRESCRIPTION => 'Prescription',
        ];
    }

    /**
     * Get all available status options
     */
    public static function getStatusOptions()
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_CANCELLED => 'Cancelled',
            self::STATUS_IN_PROGRESS => 'In Progress',
        ];
    }

    /**
     * Get formatted service name
     */
    public function getServiceNameAttribute()
    {
        $services = self::getServiceTypes();
        return $services[$this->service] ?? $this->service;
    }

    /**
     * Get formatted status name
     */
    public function getStatusNameAttribute()
    {
        $statuses = self::getStatusOptions();
        return $statuses[$this->status] ?? $this->status;
    }
}
