<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ $package->name . " Package" }}
        </h2>
    </x-slot>


    <div class="py-12 text-gray-800 dark:text-gray-200">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg flex justify-between items-center">
                <h2 class="text-xl">Delete package</h2>

                <form
                    method="POST"
                    action="{{ route("packages.destroy", [ "package" => $package ]) }}"
                >
                    @csrf
                    @method('DELETE')

                    <x-danger-button>Delete</x-danger-button>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
