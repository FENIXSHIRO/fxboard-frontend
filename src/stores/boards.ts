import { defineStore } from 'pinia';

import axios from 'axios';


export const useBoardsStore = defineStore({
    id: 'boards',
    state: () => ({
        boards: [] as any,
        board: localStorage.getItem('currentBoard'),
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
      async createNewBoard(userId: string, boardName: string) {
        const data = {
          name: boardName
        }
        const response = await axios.post(`http://localhost:3000/boards/${userId}/create`, data);
        this.boards.push( response.data )

        return response.data.name
      },
      async getBoardItems(boardId: string) {
        const response = await axios.get(`http://localhost:3000/boards/${boardId}/items`)
        return response.data
      },
      async addItemsToBoarrd(boardId: string, itemData: any) {
        await axios.post(
          `http://localhost:3000/boards/${boardId}/items/add`,
           itemData,
           {headers: {
            'Content-Type' : 'application/json'
            }
          }
        )
      },
      async updateBoardItem(boardId: string, itemData: any) {
        const response = await axios.patch(
          `http://localhost:3000/boards/${boardId}/items`,
          itemData,
          {headers: {
            'Content-Type' : 'application/json'
            }
          }
        );

        return response.data
      },
      async deleteItemFromBoard(boardId: string, itemId: string) {
        const response = await axios.delete(`http://localhost:3000/boards/${boardId}/items/${itemId}`);

        return response.data
      },
    }
});
