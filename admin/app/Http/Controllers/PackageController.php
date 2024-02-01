<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Price;
use Illuminate\Http\Request;
use Stripe\Exception\ApiErrorException;
use Stripe\Product;
use Stripe\StripeClient;

class PackageController extends Controller
{
    public function index() {
        return view("packages.index", [
            "packages" => Package::all()
        ]);
    }

    public function create(StripeClient $stripe, Request $request) {
        return view("packages.create", [
            "availableProducts" =>
                collect($stripe->products->all()->data)
                    ->filter(fn (Product $product) =>
                        $product->active &&
                        isset($product->default_price)
                    )
                    ->map(function (Product $product) use ($stripe) {
                        if (gettype($product->default_price) === "string")
                            $product->default_price = $stripe
                                ->prices
                                ->retrieve($product->default_price);
                        return $product;
                    })
                    ->filter(fn (Product $product) =>
                        $product->default_price->type === "recurring"
                    )
                    ->filter(fn (Product $product) =>
                        !Package::query()
                            ->where("id", "=", $product->id)
                            ->exists()),
            "selected" => $request->query("selected")
        ]);
    }

    public function store(Request $request, StripeClient $stripe) {
        $request->validate([
            "productId" => "required"
        ], [
            "productId.required" => "Select an option"
        ]);

        try {
            $stripeProduct = $stripe->products->retrieve($request->productId);
            if (is_null($stripeProduct))
                return back()->withErrors([
                    "productId" => "Invalid product id"
                ]);
            if (Package::query()
                ->where("id", "=", $stripeProduct->id)
                ->exists())
                return back()->withErrors([
                    "productId" => "Package already exists"
                ]);

            // getting the price
            $priceId = gettype($stripeProduct->default_price) === "string" ?
                $stripeProduct->default_price :
                $stripeProduct->id;
            $stripePrice = $stripe->prices->retrieve($priceId);
            if ($stripePrice === null)
                return back()->withErrors([
                    "productId" => "Stripe error on getting the price by id"
                ]);
            if ($stripePrice->recurring === null)
                return back()->withErrors([
                    "productId" => "Invalid product, it does not have recurring payment"
                ]);

            $price = Price::query()->findOrNew($priceId);
            if (!Price::query()
                ->where("id", "=", $price)
                ->exists()) {
                $price->id = $stripePrice->id;
                $price->currency = $stripePrice->currency;
                $price->unitAmount = $stripePrice->unit_amount;
                $price->recurringInterval = $stripePrice->recurring["interval"];
                if (!$price->save())
                    return back()->withErrors([
                        "productId" => "Failed to create Stripe price"
                    ]);
            }

            $package = Package::create([
                "id" => $stripeProduct->id,
                "name" => $stripeProduct->name,
                "description" => $stripeProduct->description,
                "priceId" => $stripePrice->id
            ]);

            return redirect()->route("packages.show", [
                "package" => $stripeProduct->id
            ]);
        } catch (ApiErrorException $error) {
            return back()->withErrors([
                "productId" => "Stripe error " . $error->getMessage()
            ]);
        }
    }

    public function show(Package $package) {
        return view("packages.show", [
            "package" => $package
        ]);
    }

    public function destroy(Package $package) {
        $package->delete();
        return redirect()->route("packages.index");
    }
}
