export default class Category {
  constructor(categoryResponse) {
    this.id = categoryResponse.id;
    this.title = categoryResponse.title;
    this.clues = this.makeClues(categoryResponse.clues);
  }

  makeClues(responseClues) {
    let clues = {};
    const validPriceValues = new Set([200, 400, 600, 800, 1000]);
    for (let responseClue of responseClues) {
      if (validPriceValues.has(responseClue.value)) {
        let newClue = {
          id: responseClue.id,
          answer: responseClue.answer,
          question: responseClue.question,
          value: responseClue.value
        };
        clues[responseClue.value] = newClue;
      }
    }

    for (let validPrice of validPriceValues) {
      if (!(validPrice in clues)) {
        return null;
      }
    }

    return clues;
  }
}