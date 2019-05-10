function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    d3.json(`/metadata/${sample}`).then( (data) => {

      d3.select('#sample-metadata')
        .html(`
        <p>AGE: ${data.AGE}</p>
        <p>BBTYPE: ${data.BBTYPE}</p>
        <p>ETHNICITY: ${data.ETHNICITY}</p>
        <p>GENDER: ${data.GENDER}</p>
        <p>LOCATION: ${data.LOCATION}</p>
        <p>WFREQ: ${data.WFREQ}</p>
        <p>sample: ${data.sample}</p>`);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    d3.json(`/samples/${sample}`).then( (data) => {
      
      // prep to sort data in descending order
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;
      var sample_values = data.sample_values;
      
      console.log(otu_ids);
      console.log(otu_labels);
      console.log(sample_values);

      // Lidio - modified app.py to sort data on the server side
      // construct pie chart
      var trace1 = {
        labels: otu_ids.slice(0,10),
        values: sample_values.slice(0,10),
        type: "pie",
        text: otu_labels.slice(0,10),
        hoverinfo: "text"
      };
      Plotly.newPlot("pie",[trace1]);

      var trace2 = {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {size: sample_values, color: otu_ids},
        text: otu_labels,
        hoverinfo: "text"
      };

      var layout2 = {
        showlegend: false
      };

      Plotly.newPlot("bubble",[trace2],layout2)
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
