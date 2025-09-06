<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clients';

    protected $fillable = [
        'fullname',
        'address', 
        'age',
        'email',
        'number'
    ];

    protected $casts = [
        'age' => 'integer',
    ];

    /**
     * The pets that belong to the client.
     */
    public function pets()
    {
        return $this->belongsToMany(\App\Models\Pet::class, 'client_pets');
    }
}
