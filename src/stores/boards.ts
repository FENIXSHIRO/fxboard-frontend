import { defineStore } from 'pinia';

import axios from 'axios';


export const useBoardsStore = defineStore({
    id: 'boards',
    state: () => ({
        boards: [] as any,
        board: JSON.parse(localStorage.getItem('currentBoard') as string),
        returnUrl: null
    }),
    getters: {

    },
    actions: {
      async getBoards(userid: string) {
        const boards = await axios.get(`http://localhost:3000/boards/byUser/${userid}`);
        // update pinia state
        this.boards = boards.data;

        return boards.data
      },
      async getBoardItems(boardId: string) {
        const response = await axios.get(`http://localhost:3000/boards/${boardId}/items`)
        return response.data
      },
      async addItemsToBoarrd(boardId: string, itemData: any) {
        await axios.post(
          `http://localhost:3000/boards/${boardId}/items`,
           itemData,
           {headers: {
            'Content-Type' : 'application/json'
            }
          }
        )
      },
      async createNewBoard(userId: string, boardName: string) {
        const data = {
          name: boardName
        }
        const response = await axios.post(`http://localhost:3000/boards/${userId}/create`, data);
        this.boards = response.data

        return response.data.name
      }
    }
});
