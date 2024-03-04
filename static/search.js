document.getElementById("search").addEventListener("input", function () {
  const search = this.value.toLowerCase();
  document.querySelectorAll("a").forEach(function (a) {
    const tags = a.getAttribute("data-tags");
    const title = a.getAttribute("data-title");
    const description = a.getAttribute("data-description");

    // Other links don't have tags
    if (!tags || !title || !description) {
      return;
    }

    if (
      tags.toLowerCase().includes(search) ||
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    ) {
      a.parentElement.style.display = "list-item";
    } else {
      a.parentElement.style.display = "none";
    }
  });
});
