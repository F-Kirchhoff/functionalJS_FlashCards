
const initModel = {
  cards: [
    {
    question: "My Question?",
    answer: "My answer.",
    id: 1000,
    state: "SHOW_FRONT",
    rank: 0,
  },
],
  nextID: 0,
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
export const saveModel = (model) => {
  download(model, 'model.json', 'json');
}

export default initModel;