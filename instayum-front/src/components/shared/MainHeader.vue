<script setup lang="ts">
function toggleHamburgerMenu() {
  const btn = document.getElementById('menu-btn')
  const menu = document.getElementById('menu')

  btn?.classList.toggle('open')
  menu?.classList.toggle('flex')
  menu?.classList.toggle('hidden')
}
</script>
<template>
  <!-- Hero Section -->
  <header id="hero">
    <!-- Hero Container -->
    <div class="mx-auto px-6 py-2 md:px-2 bg-indigo-900">
      <!-- Menu and Logo Container -->
      <nav class="flex items-center justify-between font-bold text-white">
        <a href="#/">
          <!-- Logo -->
          <img src="/instayum_logo_text.png" alt="" width="256" />
        </a>

        <!-- Menu -->
        <div class="hidden h-10 text-xl items-center px-4 md:flex md:space-x-8">
          <!-- About Link -->
          <div class="group">
            <a href="#/about">About</a>
            <div
              class="mx-2 group-hover:border-b group-hover:border-blue-50"
            ></div>
          </div>

          <!-- GitHub Link -->
          <div class="group">
            <a href="https://github.com/jescalada/instayum" target="_blank">GitHub</a>
            <div
              class="mx-2 group-hover:border-b group-hover:border-blue-50"
            ></div>
          </div>
        </div>

        <div class="md:hidden">
          <button
            id="menu-btn"
            type="button"
            class="z-40 block hamburger md:hidden focus:outline-none"
            @click="toggleHamburgerMenu()"
          >
            <span class="hamburger-top"></span>
            <span class="hamburger-middle"></span>
            <span class="hamburger-bottom"></span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div
        id="menu"
        class="z-1000 absolute top-0 bottom-0 left-0 hidden flex-col self-end w-full min-h-screen py-1 pt-32 space-y-5 text-3xl text-white bg-indigo-700 bg-opacity-80 font-bold"
      >
        <a href="#/about" class="hover:text-pink-500">About</a>
        <a href="https://github.com/jescalada/instayum" class="hover:text-pink-500" target="_blank">GitHub</a>
        <p class="text-xl font-thin">
          Made with ❤️ by
          <a
            href="https://github.com/jescalada"
            target="_blank"
            class="underline hover:text-pink-500"
            >Juan Escalada</a
          >
        </p>
      </div>
    </div>
  </header>
</template>
<style>
/* Hamburger Menu */
.hamburger {
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: all 0.25s;
  position: relative;
}

.hamburger-top,
.hamburger-middle,
.hamburger-bottom {
  position: absolute;
  width: 24px;
  height: 3px;
  top: 0;
  left: 0;
  background: #ffffff;
  transform: rotate(0);
  transition: all 0.5s;
}

.hamburger-middle {
  transform: translateY(8px);
}

.hamburger-bottom {
  transform: translateY(16px);
}

.open .hamburger-top {
  transform: rotate(45deg) translateY(6px) translateX(6px);
}

.open .hamburger-bottom {
  transform: rotate(-45deg) translateY(6px) translateX(-6px);
}

.open .hamburger-middle {
  display: none;
}
</style>
