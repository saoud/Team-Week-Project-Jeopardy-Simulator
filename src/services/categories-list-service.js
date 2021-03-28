export default class CategoriesListService {
  static getCategoryList() {
    return fetch(`https://jservice.io/api/categories?count=100`)
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
