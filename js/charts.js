function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    
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
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSamplesArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filterSamplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values =result.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(ids => "OTU" + ids).reverse();
    var top10_labels = otu_labels.slice(0,10).reverse();
    var top10_values = sample_values.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10_values,
      y: yticks,
      text: top10_labels,
      type: "bar",
      orientation: 'h'
    }];

    

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b:30

      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

     // 1. Create the trace for the bubble chart.
     var trace = [{
       x: otu_ids,
       y: sample_values,
       text: otu_labels,
       mode: "markers",
       marker: {
         size: sample_values,
         color: otu_ids,
         colorscale:"geyser"
      }
   }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      margin: {
        l: 75,
        r: 75,
        t: 75,
        b:30
      },
      hovermode:'closest'
    };

        // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", trace, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    
    // 3. Create a variable that holds the washing frequency.
    var wfreq_value = result.wfreq
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq_value,
        title: {text: "Belly Button Washing Frequency <br> Scrubs Per Week", font: {size:24}},
        gauge: {
          axis: { 
              range: [0, 10], 
              tickwidth: 1, 
              tickcolor: "black",
              nticks: 6 
          },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 4,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "darkgreen" }]},
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {t:0, b: 0 },
      width:500,
      height:400,
      font: { color: "black", family: "Arial" } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
