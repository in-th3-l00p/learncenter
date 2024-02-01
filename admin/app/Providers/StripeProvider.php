<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Stripe\StripeClient;

class StripeProvider extends ServiceProvider
{
    public function register(): void {
        $stripe = new StripeClient(config("services.stripe.secret"));

        $this->app->instance(StripeClient::class, $stripe);
    }

    public function boot(): void {
    }
}
