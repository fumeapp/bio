<template>
  <div class="logo">
    <svg viewBox="2 2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Icon-F" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path
          id="container"
          d="M4,2 L20,2 C21.1045695,2 22,2.8954305 22,4 L22,20 C22,21.1045695 21.1045695,22 20,22 L4,22 C2.8954305,22 2,21.1045695 2,20 L2,4 C2,2.8954305 2.8954305,2 4,2 Z"
        />
        <path
          id="icon"
          d="M8,14 L8,18 C6.8954305,18 6,17.1045695 6,16 L6,14 L8,14 Z M14,10 C14,11.1045695 13.1045695,12 12,12 L6,12 L6,10 L14,10 Z M18,6 C18,7.1045695 17.1045695,8 16,8 L6,8 C6,6.8954305 6.8954305,6 8,6 L18,6 Z"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.logo > svg > g > path:nth-child(1) {
  fill: rgb(var(--color-primary-900));
}
.logo > svg > g > path:nth-child(2) {
  fill: rgb(var(--color-primary-300));
}
</style>
