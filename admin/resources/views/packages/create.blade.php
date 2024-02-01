<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Add Package
        </h2>
    </x-slot>

    <section class="p-8 text-gray-800 dark:text-gray-200">
        <h3 class="text-xl mb-8">Select a Stripe product:</h3>
        <div class="flex flex-wrap gap-8 mb-8">
            @forelse ($availableProducts as $product)
                <a
                    @class([
                        "aspect-square",
                        "flex flex-col justify-center items-center p-8 w-64 rounded-md",
                        "shadow-md dark:shadow-gray-700",
                        "hover:shadow-xl hover:dark:shadow-gray-700 hover:cursor-pointer",
                        "bg-white dark:bg-gray-800 transition-all",
                        "bg-gray-100 dark:bg-gray-600" => $selected === $product->id
                    ])
                    href="{{ route("packages.create", [
                        "selected" => $selected === $product->id ? null : $product->id
                    ]) }}"
                >
                    <h4 class="text-xl">{{ $product->name }}</h4>
                    <p>{{ $product->description }}</p>
                </a>
            @empty
                <p class="text-xl">There are no Stripe products available</p>
            @endforelse
        </div>

        <form
            method="POST"
            action="{{ route("packages.store") }}"
            class="flex flex-col justify-center items-center"
        >
            @csrf

            <label for="productId" hidden>Product id</label>
            <input
                type="text"
                id="productId" name="productId"
                value="{{ $selected }}"
                hidden
            >

            @error('productId')
                <p class="text-red-600 my-8 text-xl">{{ $message }}</p>
            @enderror

            <x-primary-button type="submit">
                Add
            </x-primary-button>
        </form>
    </section>
</x-app-layout>
