import * as R from "ramda";


export const CARD_STATES = {
  SHOW_FRONT: "SHOW_FRONT",
  SHOW_BACK: "SHOW_BACK",
  EDIT: "EDIT",
}

const MSGS = {
  SET_CARD_STATE:"SET_CARD_STATE",
  SET_CARD_RANK:"SET_CARD_RANK",
  SET_CARD_A:"SET_CARD_A",
  SET_CARD_Q:"SET_CARD_Q",
  CREATE_CARD:"CREATE_CARD",
  DELETE_CARD:"DELETE_CARD",
}

export const setCardStateMsg = (id, state) => {
return {
  type: MSGS.SET_CARD_STATE,
  id,
  state,
  }
}
export const setCardRankMsg = (id, delta) => {
return {
  type: MSGS.SET_CARD_RANK,
  id,
  delta,
  }
}
export const setCardQMsg = (id, question) => {
return {
  type: MSGS.SET_CARD_Q,
  id,
  question,
  }
}
export const setCardAMsg = (id, answer) => {
return {
  type: MSGS.SET_CARD_A,
  id,
  answer,
  }
}
export const createCardMsg = () => {
return {
  type: MSGS.CREATE_CARD,
  }
}
export const deleteCardMsg = (id) => {
return {
  type: MSGS.DELETE_CARD,
  id,
  }
}


const updateCardbyId = (msg,updateFunc,cards) => {
  return R.map(card => {
    return card.id === msg.id ? 
      updateFunc(card,msg) :
      card;
  }, cards);
}


const setCardState = (card,msg) => {
  const { state } = msg;
  return {
    ...card,
    state,
  }
}
const setCardRank = (card,msg) => {
  const { delta } = msg;
  return {
    ...card,
    rank: card.rank + delta,
    state: CARD_STATES.SHOW_FRONT,
  }
}
const setCardQ = (card,msg) => {
  const { question } = msg;
  return {
    ...card,
    question,
  }
}
const setCardA = (card,msg) => {
  const { answer } = msg;
  return {
    ...card,
    answer,
  }
}

const newCard = (id) => {
  return {
    id,
    question: "",
    answer: "",
    state: CARD_STATES.EDIT,
    rank: 0,
  }
}

const sortbyRank = (list) => {
  return R.sortWith([R.ascend(R.prop("rank"))])(list);
}



const update = (msg, model) => {
  switch (msg.type) {
    case MSGS.CREATE_CARD: {
      const cards = [
        newCard(model.nextID),
        ...model.cards,
      ]
      return {
        ...model,
        cards,
        nextID: model.nextID + 1,
      }
    }

    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter((card) => card.id !== id , model.cards)
      return {
        ...model,
        cards,
      }
    }

    case MSGS.SET_CARD_STATE: {
      const cards = updateCardbyId(msg,setCardState,model.cards);
      return {
        ...model,
        cards,
      }
    }

    case MSGS.SET_CARD_RANK: {
      const cards = sortbyRank(updateCardbyId(msg,setCardRank,model.cards));
      return {
        ...model,
        cards,
      }
    }
    
    case MSGS.SET_CARD_Q: {
      const cards = updateCardbyId(msg,setCardQ,model.cards);
      return {
        ...model,
        cards,
      }
    }
    case MSGS.SET_CARD_A: {
      const cards = updateCardbyId(msg,setCardA,model.cards);
      return {
        ...model,
        cards,
      }
    }

  }
  return model;
}


export default update;