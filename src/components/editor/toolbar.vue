<template>
  <div class="shadow-md flex flex-col toolbar absolute left-[10px] bg-[#eee] top-1/4 border-[1px] rounded-lg border-solid border-[#555]">
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addSticker">
      <svg
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 13 3.5 L 13 6.2 C 13 7.88125 13 8.71875 13.328125 9.3625 C 13.615625 9.925 14.075 10.384375 14.6375 10.671875 C 15.28125 11 16.11875 11 17.8 11 L 20.5 11 M 21 12.9875 L 21 16.2 C 21 17.88125 21 18.71875 20.671875 19.3625 C 20.384375 19.925 19.925 20.384375 19.3625 20.671875 C 18.71875 21 17.88125 21 16.2 21 L 7.8 21 C 6.11875 21 5.28125 21 4.6375 20.671875 C 4.075 20.384375 3.615625 19.925 3.328125 19.3625 C 3 18.71875 3 17.88125 3 16.2 L 3 7.8 C 3 6.11875 3 5.28125 3.328125 4.6375 C 3.615625 4.075 4.075 3.615625 4.6375 3.328125 C 5.28125 3 6.11875 3 7.8 3 L 11.0125 3 C 11.746875 3 12.1125 3 12.45625 3.084375 C 12.7625 3.15625 13.05625 3.278125 13.325 3.440625 C 13.628125 3.628125 13.8875 3.8875 14.40625 4.40625 L 19.59375 9.59375 C 20.1125 10.1125 20.371875 10.371875 20.559375 10.675 C 20.721875 10.94375 20.84375 11.2375 20.915625 11.54375 C 21 11.8875 21 12.253125 21 12.9875 Z M 21 12.9875 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addText">
      <svg 
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 13 7 L 5.2 7 C 4.08125 7 3.51875 7 3.090625 7.21875 C 2.715625 7.409375 2.409375 7.715625 2.21875 8.090625 C 2 8.51875 2 9.08125 2 10.2 L 2 13.8 C 2 14.91875 2 15.48125 2.21875 15.909375 C 2.409375 16.284375 2.715625 16.590625 3.090625 16.78125 C 3.51875 17 4.08125 17 5.2 17 L 13 17 M 17 7 L 18.8 7 C 19.91875 7 20.48125 7 20.909375 7.21875 C 21.284375 7.409375 21.590625 7.715625 21.78125 8.090625 C 22 8.51875 22 9.08125 22 10.2 L 22 13.8 C 22 14.91875 22 15.48125 21.78125 15.909375 C 21.590625 16.284375 21.284375 16.590625 20.909375 16.78125 C 20.48125 17 19.91875 17 18.8 17 L 17 17 M 17 21 L 17 3 M 19.5 3 L 14.5 3 M 19.5 21 L 14.5 21 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addSquare">
      <svg
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 6 4 L 18 4 C 19.103125 4 20 4.896875 20 6 L 20 18 C 20 19.103125 19.103125 20 18 20 L 6 20 C 4.896875 20 4 19.103125 4 18 L 4 6 C 4 4.896875 4.896875 4 6 4 Z M 6 4 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addCircle">
      <svg 
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 21 12 C 21 16.971875 16.971875 21 12 21 C 7.028125 21 3 16.971875 3 12 C 3 7.028125 7.028125 3 12 3 C 16.971875 3 21 7.028125 21 12 Z M 21 12 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addTriangle">
      <svg 
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 4.24375 17.65 L 10.584375 5.671875 C 11.04375 4.803125 11.275 4.371875 11.58125 4.23125 C 11.846875 4.10625 12.153125 4.10625 12.41875 4.23125 C 12.725 4.371875 12.95625 4.803125 13.4125 5.671875 L 19.75625 17.65 C 20.165625 18.425 20.371875 18.8125 20.33125 19.13125 C 20.29375 19.40625 20.14375 19.653125 19.91875 19.815625 C 19.659375 20 19.21875 20 18.34375 20 L 5.65625 20 C 4.78125 20 4.340625 20 4.08125 19.815625 C 3.85625 19.653125 3.70625 19.40625 3.66875 19.13125 C 3.628125 18.8125 3.834375 18.425 4.24375 17.65 Z M 4.24375 17.65 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
    <hr class="my-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-50 dark:via-neutral-400" />
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addCard">
      <svg 
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-[#555]"
        fill-rule='nonzero'
        >
        <g id="surface1">
          <path d="M 7.5 8.75 C 6.808594 8.75 6.25 9.308594 6.25 10 C 6.25 10.691406 6.808594 11.25 7.5 11.25 L 12.5 11.25 C 13.191406 11.25 13.75 10.691406 13.75 10 C 13.75 9.308594 13.191406 8.75 12.5 8.75 Z M 7.5 8.75 "/>
          <path style=" fill-rule:evenodd" d="M 2.5 10 C 2.5 7.238281 4.738281 5 7.5 5 L 22.5 5 C 25.261719 5 27.5 7.238281 27.5 10 L 27.5 20 C 27.5 22.761719 25.261719 25 22.5 25 L 7.5 25 C 4.738281 25 2.5 22.761719 2.5 20 Z M 22.5 7.5 C 23.878906 7.5 25 8.621094 25 10 L 25 12.5 L 5 12.5 L 5 10 C 5 8.621094 6.121094 7.5 7.5 7.5 Z M 25 15 L 5 15 L 5 20 C 5 21.378906 6.121094 22.5 7.5 22.5 L 22.5 22.5 C 23.878906 22.5 25 21.378906 25 20 Z M 25 15 "/>
        </g>
      </svg>
    </button>
    <button class="m-1 p-1 rounded-lg hover:bg-[#ccc]" @click="addFrame">
      <svg 
        width="30px" height="30px"
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
        stroke-linejoin='round'
        stroke-linecap='round'
        >
        <g id="surface1">
          <path d="M 12 3 L 12 21 M 7.8 3 L 16.2 3 C 17.88125 3 18.71875 3 19.3625 3.328125 C 19.925 3.615625 20.384375 4.075 20.671875 4.6375 C 21 5.28125 21 6.11875 21 7.8 L 21 16.2 C 21 17.88125 21 18.71875 20.671875 19.3625 C 20.384375 19.925 19.925 20.384375 19.3625 20.671875 C 18.71875 21 17.88125 21 16.2 21 L 7.8 21 C 6.11875 21 5.28125 21 4.6375 20.671875 C 4.075 20.384375 3.615625 19.925 3.328125 19.3625 C 3 18.71875 3 17.88125 3 16.2 L 3 7.8 C 3 6.11875 3 5.28125 3.328125 4.6375 C 3.615625 4.075 4.075 3.615625 4.6375 3.328125 C 5.28125 3 6.11875 3 7.8 3 Z M 7.8 3 " transform="matrix(1.25,0,0,1.25,0,0)"/>
        </g>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    addSticker() {
      this.$emit('add-square');
    },
    addCircle() {
      this.$emit('add-circle');
    },
    addSquare() {
      this.$emit('add-square');
    },
    addTriangle() {
      this.$emit('add-triangle');
    },
    addText() {
      this.$emit('add-triangle');
    },
    addCard() {
      this.$emit('add-triangle');
    },
    addFrame() {
      this.$emit('add-triangle');
    }
  }
}
</script>

<style scoped>
</style>