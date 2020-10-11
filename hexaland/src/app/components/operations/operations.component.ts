import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { HEX_CNST } from 'src/app/constants/proj.const';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  name: string;
  edge: any;
  hexagon: any;
  existName: any;
  selectedName: any;
  results: any = [];
  constructor(private http: HttpService) {}

  ngOnInit(): void {
    let hexagon = {
      id: 'HEX_a',
      edge: {
        id: 'HEX_a',
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
      },
    };
    this.apiForAdd(hexagon);
  }
  addHexagon() {
    if (this.existName && this.edge && this.name) {
      if (parseInt(this.edge) >= 0 && parseInt(this.edge) <= 5) {
        let hexagon = {
          exist_id: this.existName,
          edge: parseInt(this.edge),
          id: this.name,
        };
        this.apiForUpdate(hexagon);
      } else {
        this.http.showToastMessage('Edge value should be 0 to 5', 'error');
      }
    } else {
      this.http.showToastMessage('Please enter all details', 'error');
    }
  }

  apiForUpdate(hex) {
    this.http.makePostApiCall('UPDATE', hex, HEX_CNST.BASE_URL).subscribe(
      (data) => {
        if (data.body.success) {
          this.http.showToastMessage('Successfully added hexagon', 'success');
        } else {
          this.http.showToastMessage('Error while adding', 'error');
        }
      },
      (err) => {
        console.log(err);
        this.http.showToastMessage(err.error.message, 'error');
      }
    );
  }

  apiForAdd(hex) {
    this.http.makePostApiCall('ADD', hex, HEX_CNST.BASE_URL).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        // this.http.showToastMessage(err.error.data,'error');
      }
    );
  }

  getData() {
    if (this.selectedName) {
      this.http
        .makeGetApiCall('FETCH', HEX_CNST.BASE_URL, this.selectedName)
        .subscribe(
          (data) => {
            if (data.body.success) {
              let res = data.body.data;
              const entries = Object.entries(res);
              entries.forEach((element) => {
                if (element[0] != 'id' && element[1] != null) {
                  this.results.push(element);
                }
              });
            }
          },
          (err) => {
            console.log(err);
            this.http.showToastMessage(err.error.message, 'error');
          }
        );
    } else {
      this.http.showToastMessage('Please enter hexagon name', 'error');
    }
  }
}
