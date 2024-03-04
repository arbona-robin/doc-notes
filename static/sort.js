let dateOrder = 1;
let titleOrder = 1;

document.getElementById("sort-by-date").addEventListener("click", function () {
  let articles = Array.from(document.querySelectorAll("#article-list li"));

  console.log("articles");

  console.log(
    articles.map((a) => a.lastElementChild.getAttribute("data-date"))
  );

  articles = articles.sort(function (a, b) {
    console.log(a.lastElementChild.getAttribute("data-date"));
    console.log(b.lastElementChild.getAttribute("data-date"));

    // New date wirh format YYYY-MM-DD
    const dateA = new Date(a.lastElementChild.getAttribute("data-date"));
    const dateB = new Date(b.lastElementChild.getAttribute("data-date"));
    console.log(dateA);
    console.log(dateB);

    console.log(
      new Date(a.lastElementChild.getAttribute("data-date")) -
        dateOrder * new Date(b.lastElementChild.getAttribute("data-date"))
    );

    return (
      dateOrder *
      (new Date(b.lastElementChild.getAttribute("data-date")) -
        new Date(a.lastElementChild.getAttribute("data-date")) >
      0
        ? 1
        : -1)
    );
  });

  console.log(
    articles.map((a) => a.lastElementChild.getAttribute("data-date"))
  );

  // Add class selected or reverse-selected to the button
  if (dateOrder === 1) {
    document.getElementById("sort-by-date").classList.add("selected");
    document
      .getElementById("sort-by-date")
      .classList.remove("reverse-selected");
  } else {
    document.getElementById("sort-by-date").classList.add("reverse-selected");
    document.getElementById("sort-by-date").classList.remove("selected");
  }
  document.getElementById("sort-by-alphabet").classList.remove("selected");
  document
    .getElementById("sort-by-alphabet")
    .classList.remove("reverse-selected");

  articles.forEach(function (article) {
    article.parentElement.appendChild(article);
  });

  dateOrder = -dateOrder;
});

document
  .getElementById("sort-by-alphabet")
  .addEventListener("click", function () {
    const articles = Array.from(document.querySelectorAll("#article-list li"));
    articles.sort(function (a, b) {
      return (
        titleOrder *
        a.lastElementChild
          .getAttribute("data-title")
          .localeCompare(b.lastElementChild.getAttribute("data-title"))
      );
    });

    console.log(
      articles.map((a) => a.lastElementChild.getAttribute("data-title"))
    );

    // Add class selected or reverse-selected to the button
    if (titleOrder === 1) {
      document.getElementById("sort-by-alphabet").classList.add("selected");
      document
        .getElementById("sort-by-alphabet")
        .classList.remove("reverse-selected");
    } else {
      document
        .getElementById("sort-by-alphabet")
        .classList.add("reverse-selected");
      document.getElementById("sort-by-alphabet").classList.remove("selected");
    }
    document.getElementById("sort-by-date").classList.remove("selected");
    document
      .getElementById("sort-by-date")
      .classList.remove("reverse-selected");

    articles.forEach(function (article) {
      article.parentElement.appendChild(article);
    });
    titleOrder = -titleOrder;
  });
