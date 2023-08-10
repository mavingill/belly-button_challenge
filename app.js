// Define the URL to fetch the data
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to update charts when dropdown selection is made
function selectionMade(selectedSample) {
  // Fetch the JSON data
  d3.json(url).then((data) => {
    // Data collection and organization
    let sampleData = data.samples.find(sampleObj => sampleObj.id == selectedSample);

    // Bar chart data
    let selectedBar = [{
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).reverse().map(labelFormat),
      orientation: "h",
      type: "bar",
      text: sampleData.otu_labels,
    }];

    // Bar chart layout
    let selectedBarLayout = {
      title: "Top 10 OTUs",
      showlegend: false,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" },
    };

    // Create the bar plot
    Plotly.newPlot("bar", selectedBar, selectedBarLayout);

    // Bubble chart data
    let selectedBubble = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
      },
      text: sampleData.otu_labels,
    }];

    // Bubble chart layout
    let selectedBubbleLayout = {
      title: "Individual Samples",
      showlegend: false,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" },
    };

    // Create the bubble plot
    Plotly.newPlot("bubble", selectedBubble, selectedBubbleLayout);

    // Demographic info table
    let metadata = data.metadata.find(sampleObj => sampleObj.id == selectedSample);
    let demographicInfo = d3.select('#sample-metadata').selectAll("li").data(Object.entries(metadata));

    // Update the demographic info
    demographicInfo.enter()
      .append("li")
      .merge(demographicInfo)
      .text(([key, value]) => `${key}: ${value}`)
      .style("font", "20px")
      .style("list-style-type", "none")
      .exit().remove();
  });
}

// Binary search to get the data based on selection made in the dropdown menu
function binarySearch(list, val) {
  let left = 0;
  let right = list.length - 1;
  let mid;

  while (left <= right) {
    mid = Math.floor((left + right) / 2);

    if (list[mid] === val) {
      return mid;
    } else if (list[mid] < val) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Function to populate the dropdown menu
function populateDropdownMenu() {
  d3.json(url).then((data) => {
    let dropdown = d3.select("#selDataset");
    let names = data.names;

    dropdown.selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .text(d => d)
      .property("value", d => d);
  });
}

// Function to format y-axis of bar chart
function labelFormat(numb) {
  return 'OTU ' + numb;
}

// Call the function to populate the dropdown menu
populateDropdownMenu();

// Initialize the charts with the first sample data
d3.json(url).then((data) => {
  let initialSample = data.names[0];
  selectionMade(initialSample);
});

// Event listener for dropdown menu change
//d3.select("#selDataset").on("change", function () {
  //let selectedSample = d3.event.target.value;
  //selectionMade(selectedSample);
//});

// Define the optionChanged function to handle dropdown changes
//function optionChanged(selectedSample) {
  //selectionMade(selectedSample);
//}