import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { CanvasJS } from 'src/assets/canvasjs.angular.component';

// Done by Harshath.M

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private http:HttpClient) { }
  csv_data:any;
  metrics:any;
	chartOptions:any;
  keys:any;
	load_graph = false;
  load_table = false;
  displayedColumns=["Metrics", "Values"];
  api_url = "http://127.0.0.1:5000/api/";

  ngOnInit(): void {
		this.http.get(this.api_url+"get_csv",{responseType:"text"}).subscribe((res)=>{
			this.csv_data = res;
			this.open_page();
			this.load_graph = true;
		});
    this.http.get(this.api_url+"metrics").subscribe({
      next:((res:any)=>{
        this.metrics=res;
        this.keys = Object.keys(res);
        this.load_table = true;
      })
    });

  }
  getDataPointsFromCSV(csv:any, col:number) {                       //https://canvasjs.com/docs/charts/how-to/create-charts-from-csv/
    let dataPoints =[];
		let csvLines = [];
		let points = [];
    let date = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);       
    for (var i = 0; i < csvLines.length; i++)
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            date = points[0].split("-");
            dataPoints.push({ 
              x: new Date(date[0],date[1]-1),           //month starts from 0 . so only there is -1
              y: parseInt(points[col]) 		
				});
		}
		return dataPoints;
	}
	
	open_page(){
		this.chartOptions = {                              //https://canvasjs.com/angular-charts/multi-series-chart/
      animationEnabled: true,
			zoomEnabled: true,
			exportEnabled: true,
			theme: "light2",
			title: {
				text: "Predicted Graph"
			},
      axisX: {                                          //https://canvasjs.com/docs/charts/methods/canvasjs/format-date/
        labelFormatter: function (e:any) {
          return CanvasJS.formatDate( e.value, "MMM YY"); 
        },
        labelAngle: -20
      }, 
      axisY:{
        title: "Sales"
      },
			data: [{
				type: "line",
        color:"orange",
        showInLegend: true,
		    name: "Actual Sales",
		    dataPoints: this.getDataPointsFromCSV(this.csv_data, 1)
			},{
        type: "line",
        color:"blue",
        showInLegend: true,
        name: "Predicted Sales",
        dataPoints: this.getDataPointsFromCSV(this.csv_data, 2)
      }]
		}
	}

  download_csv(){
    this.http.get(this.api_url+"get_csv",{responseType:"blob"}).subscribe((res)=>{
			saveAs(res,"Predicted.csv");
		});
  }

  download_metrics(){
    this.http.get(this.api_url+"metrics",{responseType:"blob"}).subscribe((res)=>{
			saveAs(res,"Metrics.json");
		});
  }

}
