import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';


// Done by Harshath.M

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private http:HttpClient) { }
	chartOptions:any;
  pred_value = 0 ;
	load_graph = false;
  api_url = "http://127.0.0.1:5000/api/";

  ngOnInit(): void {
		this.http.get(this.api_url+"predict").subscribe((res:any)=>{
      this.pred_value = res.value;
			this.open_page();
			this.load_graph = true;
		});
  }
  getDataPoints() { 
    let dataPoints =[];       
    for (var i = 0; i <= 9 ; i++)
      dataPoints.push({ 
        x: i,          
        y: 0		
      });
    dataPoints[this.pred_value]= { x : this.pred_value ,y:100, indexLabel: "Highest\u2705"};
    console.log(dataPoints);
		return dataPoints;
	}
	
	open_page(){
		this.chartOptions = {                              //https://canvasjs.com/angular-charts/chart-index-data-label/
      animationEnabled: true,
			exportEnabled: true,
			theme: "light2",
			title: {
				text: "Recognized Result"
			},
      axisX: {     
        title: "Digits"
      }, 
      axisY:{
        title: "Prediction value (%)"
      }, 
			data: [{
				type: "column",
		    dataPoints: this.getDataPoints()
			}]
		}
	}

  download_csv(){
    this.http.get(this.api_url+"get_csv",{responseType:"blob"}).subscribe((res)=>{
			saveAs(res,"Predicted.csv");
		});
  }

}
