<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div
                class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg grid grid-cols-2 items-center text-center"
            >
                <h2 class="p-6 text-gray-900 dark:text-gray-100 text-xl">
                    {{ __("Package count: ") }}
                </h2>
                <div class="p-6 text-gray-900 dark:text-gray-100 text-4xl">
                    {{ \App\Models\Package::query()->count() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
