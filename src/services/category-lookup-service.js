export default class CategoryLookupService {
  static getCategory(input) {
    return fetch(`https://jservice.io/api/category?id=${input}`)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(function (error) {
        return Error(error);
      });
  }
}

