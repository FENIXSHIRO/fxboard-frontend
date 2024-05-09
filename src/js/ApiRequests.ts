import axios from "axios";

const boardId = '663ce1faa49bd5154f8ee6b7'

export async function getBoardItems() {
  const boardsR = await axios.get(`http://localhost:3000/boards/${boardId}/items`)
  return boardsR.data
}

export async function postNewBoardElement(itemData: any) {
  const addItemResponse = await axios.post(
    `http://localhost:3000/boards/${boardId}/items`,
     itemData,
     {headers: {
      'Content-Type' : 'application/json'
    }});
}
