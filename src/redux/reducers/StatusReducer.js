import {
  GET_SCHEDULE_STATUS,
  GET_SCHEDULE_CARDS,
  CLEAR_STATUS,
  REFINISH_TASK,
  DRAG_HAPPENED,
  START_TASK,
  FINISH_TASK,
  ARCHIVE_TASK,
  PIN_TASK,
  UN_PIN_TASK,
  RE_START_TASK,
  GET_TEAMS_CARDS,
} from "../actions/rootActions";

const initialState = [];
let lists;
const StatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE_STATUS: {
      lists = action.payload;
      return action.payload;
    }

    case GET_SCHEDULE_CARDS: {
      const newState = action.payload;
      lists = action.payload;
      return newState;
    }
    case GET_TEAMS_CARDS: {
      const newState = action.payload;
      lists = action.payload;
      return newState;
    }
    case PIN_TASK: {
      const newStatePin = [...state];
      let myList = lists.find((list) => list.id == action.payload.status);
      let cardTo = myList.cards.find((card) => card.id == action.payload.id);
      cardTo.isPinned = true;
      myList.cards.splice(myList.cards.indexOf(cardTo), 1);
      myList.cards.unshift(cardTo);
      console.log(newStatePin);
      return newStatePin;
    }
    case UN_PIN_TASK: {
      const newStatePin = [...state];
      let myList = lists.find((list) => list.id == action.payload.status);
      let cardTo = myList.cards.find((card) => card.id == action.payload.id);
      cardTo.isPinned = false;
      myList.cards.splice(myList.cards.indexOf(cardTo), 1);
      myList.cards.splice(action.payload.id, 0, cardTo);
      return newStatePin;
    }

    case START_TASK: {
      const newState = [...state];
      const listRemoveCard = state.find((list) => list.id == 1);

      let cardTo = listRemoveCard.cards.find(
        (card) => card.id == action.payload.id
      );

      listRemoveCard.cards.splice(listRemoveCard.cards.indexOf(cardTo), 1);
      cardTo = { ...cardTo, ...action.payload };
      //cardTo.status = 2;
      const listPushCard = state.find((list) => list.id == 2);
      if (cardTo.isPinned === true) {
        listPushCard.cards.unshift(cardTo);
      } else {
        listPushCard.cards.splice(action.payload.id, 0, cardTo);
      }
      return newState;
    }
    case REFINISH_TASK: {
      const newState = [...state];
      const listRemoveCard = state.find((list) => list.id == 3);

      let cardTo = listRemoveCard.cards.find(
        (card) => card.id == action.payload.id
      );

      listRemoveCard.cards.splice(listRemoveCard.cards.indexOf(cardTo), 1);
      cardTo = { ...cardTo, ...action.payload };
      //cardTo.status = 2;
      const listPushCard = state.find((list) => list.id == 2);
      if (cardTo.isPinned === true) {
        listPushCard.cards.unshift(cardTo);
      } else {
        listPushCard.cards.splice(action.payload.id, 0, cardTo);
      }
      return newState;
    }
    case RE_START_TASK: {
      const newState = [...state];
      const listRemoveCard = state.find((list) => list.id == 2);

      let cardTo = listRemoveCard.cards.find(
        (card) => card.id == action.payload.id
      );

      const myIndex = listRemoveCard.cards.indexOf(cardTo);
      listRemoveCard.cards.splice(listRemoveCard.cards.indexOf(cardTo), 1);
      cardTo = { ...cardTo, ...action.payload };
      //cardTo.status = 1;
      const listPushCard = state.find((list) => list.id === 1);
      if (cardTo.isPinned === true) {
        listPushCard.cards.unshift(cardTo);
      } else {
        listPushCard.cards.splice(action.payload.id, 0, cardTo);
      }

      return newState;
    }

    case FINISH_TASK: {
      const newState = [...state];
      const listRemoveCard = state.find((list) => list.id == 2);

      let cardTo = listRemoveCard.cards.find(
        (card) => card.id == action.payload.id
      );

      const myIndex = listRemoveCard.cards.indexOf(cardTo);
      listRemoveCard.cards.splice(listRemoveCard.cards.indexOf(cardTo), 1);
      cardTo = { ...cardTo, ...action.payload };
      //cardTo.status = 3;
      const listPushCard = state.find((list) => list.id === 3);
      if (cardTo.isPinned === true) {
        listPushCard.cards.unshift(cardTo);
      } else {
        listPushCard.cards.splice(action.payload.id, 0, cardTo);
      }
      return newState;
    }

    case ARCHIVE_TASK: {
      const newArchiveState = [...state];
      if (action.payload.isArchived) {
        const listArchiveRemoveCard = state.find((list) =>
          list.cards.find((card) => card.id === action.payload.id)
        );
        let cardTo = listArchiveRemoveCard.cards.find(
          (card) => card.id === action.payload.id
        );

        listArchiveRemoveCard.cards.splice(
          listArchiveRemoveCard.cards.indexOf(cardTo),
          1
        );
      }
      return newArchiveState;
    }

    case CLEAR_STATUS: {
      return [];
    }
    case DRAG_HAPPENED: {
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexEnd,
        droppableIndexStart,

        type,
      } = action.payload;
      const newState = [...state];
      // other list
      if (droppableIdStart !== droppableIdEnd) {
        // find the list where the drag happened
        const listStart = state.find(
          (list) => droppableIdStart === String(list.id)
        );
        //pull out card from this list

        // const card = listStart.cards.splice(droppableIndexStart, 1);
        // listStart.cards.filter((c) => c.id !== card.id);
        // //find list where drag end
        // const listEnd = state.find(
        //   (list) => droppableIdEnd === String(list.id)
        // );
        //put the card in new list
        // console.log(droppableIndexEnd);
        // console.log(...card);
        // listEnd.cards.splice(droppableIndexEnd, 0, ...card);
      }
      console.log(newState);
    }
    default:
      return state;
  }
};
export default StatusReducer;
