<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $connection = 'payments';
    protected $table = 'Package';
    protected $casts = [
        "id" => "string"
    ];

    const CREATED_AT = "createdAt";
    const UPDATED_AT = "updatedAt";

    protected $fillable = [
        "id", "name", "description", "priceId"
    ];

    public function price() {
        return $this->hasOne(Price::class, "priceId");
    }
}
