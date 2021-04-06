export default class Category {
  constructor(categoryResponse) {
    this.id = categoryResponse.id;
    this.title = categoryResponse.title;
    this.clues = this.makeClues(categoryResponse.clues);
  }

  makeClues(responseClues) {
    let clues = {};
    for (let responseClue of responseClues) {
      if (responseClue.value === null) {
        return null;
      }
      if (responseClue.value === 200 || 
          responseClue.value === 400 ||
          responseClue.value === 600 ||
          responseClue.value === 800 ||
          responseClue.value === 1000) {
        let newClue = {
          id: responseClue.id,
          answer: responseClue.answer,
          question: responseClue.question,
          value: responseClue.value
        };
        clues[responseClue.value] = newClue;
      }
    }
    return clues;
  }
}