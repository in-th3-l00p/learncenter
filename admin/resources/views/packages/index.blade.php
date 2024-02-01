<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Packages
            </h2>

            <a href="{{ route("packages.create") }}">
                <x-primary-button class="ml-4">
                    {{ __("Add Package") }}
                </x-primary-button>
            </a>
        </div>
    </x-slot>

    <div class="flex flex-wrap p-8 gap-8 text-gray-800 dark:text-gray-200">
        @forelse ($packages as $package)
            <a
                @class([
                    "aspect-square",
                    "flex flex-col justify-center items-center p-8 w-64 rounded-md",
                    "shadow-md dark:shadow-gray-700",
                    "hover:shadow-xl hover:dark:shadow-gray-700 hover:cursor-pointer",
                    "bg-white dark:bg-gray-800",
                    "hover:bg-gray-100 hover:dark:bg-gray-600 transition-all"
                ])
                href="{{ route("packages.show", [ "package" => $package ]) }}"
            >
                <h4 class="text-xl">{{ $package->name }}</h4>
                <p>{{ $package->description }}</p>
            </a>
        @empty
            <h2 class="text-xl">There are no packages.</h2>
        @endforelse
    </div>
</x-app-layout>
