function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
      console.log(data)
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
          selector
              .append("option")
              .text(sample)
              .property("value", sample);
      });

      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
      var metadata = data.metadata;
      console.log(data)
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      PANEL.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
      console.log(data);

      // Create a variable that holds the samples array.
      console.log(data);
      var samplesArray = data.samples;
      console.log(samplesArray);

      // Create a variable that filters the samples for the object with the desired sample number.
      var selectedIdSamples = samplesArray.filter(data => data.id == sample);
      console.log(selectedIdSamples);

      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var metaresultArray = metadata.filter(sampleObj => sampleObj.id == sample);


      // Create a variable that holds the first sample in the array.
      var firstSample = selectedIdSamples[0];
      console.log(firstSample);

      // 2. Create a variable that holds the first sample in the metadata array.
      var metaresult = metaresultArray[0];

      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
      console.log(otuIds);
      console.log(otuLabels);

      // 3. Create a variable that holds the washing frequency.
      var meta_wfreq = metaresult.wfreq;
      console.log(meta_wfreq)
      // Create the yticks for the bar chart.
      var yticks = otuIds.slice(0, 10).map(id => "OTU " + id).reverse();
      console.log(yticks);
      // Use Plotly to plot the bar data and layout.
      //Plotly.newPlot();
      // 8. Create the trace for the bar chart. 
      var barData = [{
          x: sampleValues.slice(0, 10).reverse(),
          text: otuLabels.slice(0, 10).reverse(),
          type: "bar"
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
          title: { text: "<b>Top 10 Bacteria Cultures Found<b>" },
          yaxis: {
              tickmode: "array",
              tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              ticktext: yticks
          },
          annotations: [{
              xref: 'paper',
              yref: 'paper',
              x: 0.5,
              xanchor: 'center',
              y: -0.25,
              yanchor: 'center',
              text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in each test subjects belly button',
              showarrow: false
          }]
      };
      //console.log
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout, { responsive: true });
      // Use Plotly to plot the bubble data and layout.
      //Plotly.newPlot();
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: "markers",
          marker: {
              size: sampleValues,
              color: otuIds,
              colorscale: "purples"
          }
      }];
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
          title: { text: "<b>Bacterial Cultures Per Sample<b>" },
          xaxis: { title: "Culture ID (OTU ID)", automargin: true },
          yaxis: { title: "# of Cultures", automargin: true },
          hovermode: "closest"
      }
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, { responsive: true });

      // 4. Create the trace for the gauge chart.
      var gaugeData = [
          {
              domain: { x: [0, 1], y: [0, 1] },
              value: meta_wfreq,
              title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  axis: { range: [null, 10] },
                  bar: { color: "black" },
                  steps: [
                      { range: [0, 2], color: "lightgray" },
                      { range: [2, 4], color: "gray" },
                      { range: [4, 6], color: "white" },
                      { range: [6, 8], color: "pink" },
                      { range: [8, 10], color: "red" },]
              }
          }
      ];
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
          width: 600, height: 450, margin: { t: 0, b: 0 }
      };

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout, { responsive: true });
  });
}