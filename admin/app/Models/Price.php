<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;

    protected $connection = "payments";
    protected $table = "Price";
    protected $casts = [
        "id" => "string"
    ];

    const CREATED_AT = "createdAt";
    const UPDATED_AT = "updatedAt";

    protected $fillable = [
        "id", "currency", "unitAmount", "recurringInterval"
    ];

    public function packages() {
        return $this->belongsToMany(Package::class);
    }
}
