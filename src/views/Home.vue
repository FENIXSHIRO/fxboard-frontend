<template>
  <div class="mt-10 p-10">
    <div class="">
      <h1 class="text-left text-2xl font-bold">Ваши доски</h1>
      <hr class="my-1 h-px border-t-0 bg-[#ddd]" />
      <div class="flex flex-wrap m-5 ml-0">
        <div 
          v-for="board in boards"
          @click="openBoard(board._id)"
          class="me-3 mb-3 w-[150px] h-[150px] relative border shadow-md rounded-lg align-middle hover:bg-[#eee] cursor-pointer"
        >
          <div class="absolute bottom-0 w-full h-10 border rounded-b-lg text-center align-middle">
            {{ board.name }}
          </div>
        </div>
        <div @click="createBoardModal" class="w-[150px] h-[150px] p-11 border shadow-md rounded-lg align-middle hover:bg-[#eee] cursor-pointer">
          <svg
            viewBox="0 0 200 200"
            class="m-auto max-w-[50px] fill-none stroke-2 stroke-[#555]"
            stroke-linejoin='round'
            stroke-linecap='round'
            >
            <g id="surface1">
              <path d="M 5.000156 12 L 18.999844 12 " transform="matrix(8.333333,0,0,8.333333,0,0)"/>
              <path d="M 12 5.000156 L 12 18.999844 " transform="matrix(8.333333,0,0,8.333333,0,0)"/>
              </g>
          </svg>
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-left font-bold">Доступные доски</h1>
      <hr class="my-1 h-px border-t-0 bg-[#ddd]" />
      <div class="flex flex-wrap m-5 ml-0">
        <div v-for="n in 3" class="me-3 mb-3 w-[150px] h-[150px] border shadow-md rounded-lg align-middle hover:bg-[#eee]">
          {{n}}
        </div>
      </div>
    </div>
  </div>
  <ElDialog
    v-model="showBoardCreationModal" 
    class="rounded-md"
    title="Создать новую доску" 
    width="500"
  >
    <ElForm :model="form">
      <ElFormItem label="Название доски" :label-width="140">
        <ElInput v-model="form.name" autocomplete="off" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="showBoardCreationModal = false">Отмена</ElButton>
        <ElButton type="primary" @click="createNewBoard">
          Создать
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBoardsStore } from '@/stores/boards'
import { ElMessage, ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';

export default defineComponent({
  components: {
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    return {
      authStore: useAuthStore(),
      boardsStore: useBoardsStore()
    }
  },
  data: () => ({
    boards: [] as any,
    showBoardCreationModal: false,
    form: {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    }
  }),
  props: {},
  emits: [],
  computed: {
    userId() {
      return this.authStore.user._id
    }
  },
  methods: {
    async getBoards() {      
      this.boards = await this.boardsStore.getBoards(this.userId)
    },
    openBoard(id: string) {
      this.$router.push(`/board/${id}`);
    },
    createBoardModal() {
      this.showBoardCreationModal = true
    },
    async createNewBoard() {
      if(this.form.name === '') {
        ElMessage({
          message: 'Название не введено',
          type: 'warning',
          grouping: true
        })
        return
      }
      const newBoardName = await this.boardsStore.createNewBoard(this.userId, this.form.name)

      ElMessage({
        message: `Доска "${newBoardName}" создана`,
        type: 'success',
        plain: true,
      })

      this.getBoards()
      this.showBoardCreationModal = false
    }
  },
  mounted() {
    this.getBoards()
  }
})
</script>

<style scoped>
</style>