// Url for data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch json data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Create dropdown menu function
function dropDown() {

    // 1. Use the D3 library to read the sample data
    let dropDownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let sampleNames = data.names;
        sampleNames.forEach((id) => {

            // Console log value for each id
            console.log(id);

            dropDownMenu.append("option").text(id).property("value", id);
        });

        let sample = sampleNames[0];
        console.log(sample);

        // Build initial plots
        buildBarChart(sample);
        buildBubbleChart(sample);
        buildMetaData(sample);

    });
};

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function buildBarChart(sample) {
    d3.json(url).then((data) => {

        // Get all sample data
        let dataSamples = data.samples;
        let value = dataSamples.filter(result => result.id == sample);

        // Get first index value and data for chart
        let dataValue = value[0]

        let sample_values = dataValue.sample_values;
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;

        // Console log data
        console.log(sample_values, otu_ids, otu_labels);

        // Setup chart parameters to show top 10 items in decending (reverse) order
        let xValue = sample_values.slice(0,10).reverse();
        let yValue = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Setup trace for bar chart
        let barTrace = {
            x: xValue,
            y: yValue,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup layout for bar chart
        let layout = {
            title: "Top 10 OTUs Found in an Individual"
        };

        // Use Plotly to plot bar chart
        Plotly.newPlot("bar", [barTrace], layout)
    });
};

// 2. Create a bubble chart that displays each sample.
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        
        // Get all sample data
        let dataSamples = data.samples;
        let value = dataSamples.filter(result => result.id == sample);

        // Get first index value and data for chart
        let dataValue = value[0];

        let sample_values = dataValue.sample_values;
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;

        // Console log data
        console.log(sample_values, otu_ids, otu_labels);

        // Setup trace for the bubble chart
        let bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: "Earth"
            }
        };
        
        // Setup layout for bubble chart
        let layout = {
            title: "Bacteria Diversity per Sample",
            xaxis: {title: "OTU ID"},
            hovermode: "closest"
        };

        // Use Plotly to plot bubble chart
        Plotly.newPlot("bubble", [bubbleTrace], layout)
    });
};

// 4. Display the sample metadata
function buildMetaData(info) {
    d3.json(url).then((data) => {

        // Get all metadata
        let metadata = data.metadata
        let value = metadata.filter(result => result.id == info);

        // Console log metadata
        console.log(value);

        // Get first index value
        let dataValue = value[0]
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key-value pair from the metadata
        Object.entries(dataValue).forEach(([key, value]) => {

            // Console log key-value pairs
            console.log(key, value);

            // 5. Display each key-value pair on the page
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// 6. Update all the plots when a new sample is selected.
function optionChanged(value) {

    // Console log new value
    console.log(value);

    // Update values
    buildBarChart(value);
    buildBubbleChart(value);
    buildMetaData(value);
};

dropDown();