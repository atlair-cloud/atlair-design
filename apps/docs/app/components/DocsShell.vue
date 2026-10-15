<template>
  <div
    class="mx-auto grid max-w-[88rem] lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_14rem]"
  >
    <aside class="hidden border-r border-border lg:block">
      <div class="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-10">
        <SidebarNav />
      </div>
    </aside>
    <main id="content" tabindex="-1" class="min-w-0 px-5 py-10 outline-none sm:px-10 lg:px-14 lg:py-14">
      <slot />
    </main>
    <aside class="hidden xl:block">
      <div class="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-14 pr-6">
        <slot name="aside" />
      </div>
    </aside>
  </div>
</template>
