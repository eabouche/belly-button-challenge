// Get API Endpoint URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function buildMetadata(newSample){

    // Fetch the json data and console log it
    d3.json(url).then(function (data){
        console.log('Samples data:', data);
        let metadata = data.metadata;

        console.log('Metadata:', metadata);

        // filter the data for the object with the desired sample number
        let resultArray = metadata.filter(id => id.id == newSample);
        let result = resultArray[0];
        console.log('Sample object:', result);

        // use d3 to select the panel with id of `#sample-metadata`
        // d3.select('#sample-metadata');

        // Use `.html("") to clear any existing metadata
        d3.select('#sample-metadata').html("");

        // Hint: Inside the loop, you will need to use D3 to append new
        // tags for each key-value in the metadata 
        for (key in result){
            // This line of code takes d3 selection and appends text to it
            d3.select('#sample-metadata').append("h5").text(`${key} : ${result[key]}`);

        };
    });
};

    // let samples = data.samples;
    // let resultSamples = samples.filter(item => item.id = 940);
    // let resultSample = resultSamples[0];
    // console.log('Sample metadata:', resultSample);

    // let otuIds = [];
    // otuIds.push(resultSample.otu_ids);
    // console.log(otuIds);


    // let otuSampleValues = [];
    // otuSampleValues.push(resultSample.sample_values);
    // console.log(otuSampleValues);\


// Build gauge chart accessing Metadata property
function buildGaugeChart(sample){
    // Fetch the json data and console log it
    d3.json(url).then(function (data){
        //console.log('Samples data:', data);
        let metadata = data.metadata;

        //console.log('Metadata:', metadata);

        // filter the data for the object with the desired sample number
        let resultArray = metadata.filter(id => id.id == sample);
        let result = resultArray[0];
        console.log('Sample object:', result);

        // create a float variable
        let frequency = parseFloat(result.wfreq);

        let gaugeData = {
            title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
            type : "indicator",
            mode : "gauge+number" ,
            value : frequency,
            domain : {x: [0,1], y:[0,1]},
            gauge : {
                axis : {range: [null,10]},
                bar : {color: "004666"},
                steps : [
                    {range: [0,2],color:"#ffffd4"},
                    {range: [2,4],color:"#eaf4f6"},
                    {range: [4,6],color:"#d6e9ed"},
                    {range: [6,8],color:"#c1dee5"},
                    {range: [8,10],color:"#add4dc"}
                ],

            }
        };

        let gaugeDataArray = [gaugeData];

        // Create layout
        let gaugeLayout = {
            width: 500,
            height: 400,
            margin: {
                t:  25,
                r: 25,
                l: 25,
                b: 25
            },
            font: {
                color: "darklavender",
                familiy:"Tahoma"
            }
        };

        Plotly.newPlot("gauge",gaugeDataArray, gaugeLayout);

    });


};


// Create a function to build the charts
function buildCharts(sample) {
	d3.json(url).then(function(data){
		let samples = data.samples;
		let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
		let result = resultArray[0];
		
		let otu_ids = result.otu_ids;
		let otu_labels = result.otu_labels;
		let sample_values = result.sample_values;
		
		// Build a Bubble Chart
		let bubbleChart = {
            x : otu_ids,
            y : sample_values,
            text : otu_labels,
            mode : "markers",
            marker : {
                size : sample_values,
                color : otu_ids,
                colorscale : "Earth"  // CHANGE ME !!!!!!!!!!!!!
            }

        }

        let bubbleChartDataArray = [bubbleChart];

        // Do layout
        bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis : {title: "OTU ID (Microbial Species Identification Number)"},
            yaxis : {title: "Amount Present in Culture"}
        };

		// Dispay bubble plot
		Plotly.newPlot("bubble",bubbleChartDataArray, bubbleLayout);
		
		// Build a Bar Chart

        let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xvalues = sample_values.slice(0,10).reverse();
        let labelValues = otu_labels.slice(0,10).reverse();

        let barChart = {
            x : xvalues,
            y : yvalues,
            text : labelValues,
            type : 'bar',
            orientation : 'h' 
        };

        let barChartArray = [barChart];

        // Set the layout
        let barLayout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar",barChartArray, barLayout);
		
	});
};


// Create a function that initializes the dashboard 
function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
    console.log("Init Selector", selector);
  
    // Use the list of sample names to populate the select options
    d3.json(url).then(function(data){
      let sampleNames = data.names;
      console.log("Data names", sampleNames);
  
      // Use a for loop to append to the 'selector' object 
      for (let i = 0; i < sampleNames.length; i++){
        // append to the selector object
        selector.append("option").text(sampleNames[i]).property("value",sampleNames[i]);
      };
  
      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);              
      buildMetadata(firstSample);
      buildGaugeChart(firstSample);
    });
  };

// Don't make any changes below this line 
// optionChanged() function is referenced in line 25 of index.html

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);      
    buildMetadata(newSample);
    buildGaugeChart(newSample);
  };
  
// Initialize the dashboard
init();

