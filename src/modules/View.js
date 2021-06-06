import { h } from "virtual-dom";
import hh from "hyperscript-helpers";
import * as R from "ramda";
import { 
  CARD_STATES,
  setCardStateMsg,
  setCardRankMsg,
  setCardQMsg,
  setCardAMsg,
  createCardMsg,
  deleteCardMsg,
} from "./Update";

const {
  div,
  h1,
  h6,
  textarea,
  p,
  i,
  pre,
  button,
} = hh(h);


const editInput = (value, oninput) => {
  return textarea({
    className: "w-100 bg-washed-yellow bn mv2",
    value,
    oninput,
  })
}

const cardLabel = (text) => {
  return h6({ className: "b f6 ma0 underline" }, text);
}

const cardText = (text, onclick) => {
  return p({ 
    className: "f3 pointer mv0 pv2 br2 bg-animate hover-bg-washed-yellow",
    onclick,
  }, text );
}

const buttonView = (text,color, onclick) => {
  return button({
    className : `pv2 ph3 bn br2 pointer white ${color}`,
    onclick
  }, text)
}


const cardFrontView = (dispatch, card) => {
  const { question, id } = card;

  return [
    h6({ className: "b f6 ma0 underline" }, "Question"),
    cardText(question, () => dispatch(setCardStateMsg(id,CARD_STATES.EDIT))),
    h6({ 
      className: "f6 normal pointer ma0 mb5 underline",
      onclick: () => dispatch(setCardStateMsg(id,CARD_STATES.SHOW_BACK)),
       }, "Show Answer"),
  ];
}

const cardBackView = (dispatch, card) => {
  const { question, answer, id } = card;

  return [
    cardLabel("Question"),
    cardText(question, () => dispatch(setCardStateMsg(id,CARD_STATES.EDIT))),
    cardLabel("Answer"),
    cardText(answer, () => dispatch(setCardStateMsg(id,CARD_STATES.EDIT))),
    div({ className: "flex justify-between mt2" },[
      buttonView("Bad", "bg-light-red", () => dispatch(setCardRankMsg(id,-1))),
      buttonView("Good", "bg-light-green", () => dispatch(setCardRankMsg(id,1))),
      buttonView("Great", "bg-green", () => dispatch(setCardRankMsg(id,2))),
    ])
  ];
}
const cardEditView = (dispatch, card) => {
  const { question, answer, id } = card;

  return [
    cardLabel("Question"),
    editInput(question, e => dispatch(setCardQMsg(id,e.target.value))),
    cardLabel("Answer"),
    editInput(answer, e => dispatch(setCardAMsg(id,e.target.value))),
    buttonView("Save","bg-dark-gray",() => dispatch(setCardStateMsg(id,CARD_STATES.SHOW_FRONT))),
  ]
}

const setCardState = (state) => {
  switch(state) {
    case CARD_STATES.SHOW_FRONT:
      return cardFrontView;
    case CARD_STATES.SHOW_BACK:
      return cardBackView;
    case CARD_STATES.EDIT:
      return cardEditView;
    default: return cardFrontView;
  }
}

const cardView = (dispatch, card) => {
    const { state,id } = card;

    return div({ className: "bg-light-yellow pa2 ma2 br2 w-30 shadow-1 relative", style: "min-width: 330px;  min-height: 200px"},[
      setCardState(state)(dispatch, card),
      i({
        className: "fas fa-minus-circle f5 absolute top-1 right-1 pointer dim",
        onclick: () => dispatch(deleteCardMsg(id)),
      })
    ])
}

const cardSetView = (dispatch,model) => {
  const { cards } = model;
  return  div({ className: " w-100 flex flex-wrap mt3"},
    R.map(R.curry(cardView)(dispatch), cards),
  )
}

const view = (dispatch,model) => {
  return div({ className: "center mv4 mh3" }, [
    h1( {className: "f2 pv2 bb" }, "Flashcard Study"),
    buttonView("Add","bg-dark-blue",() => dispatch(createCardMsg(model.nextID))),
    cardSetView(dispatch,model),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;