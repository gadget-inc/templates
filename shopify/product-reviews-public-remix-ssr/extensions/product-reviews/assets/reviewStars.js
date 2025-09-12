// This script dynamically generates star ratings for product reviews
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < window.reviews.length; i++) {
    const reviewDiv = document.getElementById(`review-${i}`);

    for (let j = 1; j <= 5; j++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "-2.15 -2.15 58.17 58.17");
      svg.setAttribute("height", "18px");
      svg.setAttribute("width", "18px");

      // Create the polygon element
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute(
        "fill",
        `${j <= parseFloat(window.reviews[i].rating.value) ? "#EFCE4A" : "#808080"}`
      );
      polygon.setAttribute(
        "points",
        "26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
      );

      // Append the polygon to the SVG
      svg.appendChild(polygon);

      // Append the SVG to the div
      reviewDiv.appendChild(svg);
    }
  }
});
