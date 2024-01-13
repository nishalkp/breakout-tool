import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'breakout-web';
  selectedFile: File | null = null;
  niftyUploaded = false;
  sDateUploaded = false;
  fDateUploaded = false;
  niftyNextUploaded = false;
  upldFiles: filesObj = new filesObj();
  FinalDataSet: any;

  private baseUrl = 'http://localhost:8080/upload'; // Update with your Spring Boot server URL

  constructor(private http: HttpClient) {}

  onNiftyFileSelected(event: any): void {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.http.post('http://localhost:8080/uploadone', formData).subscribe(
      (response: any) => {
        this.niftyUploaded = true;
        this.upldFiles.nifty = response;
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.niftyUploaded = false;
      }
    );
  }
  onNextFileSelected(event: any): void {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.http.post('http://localhost:8080/uploadone', formData).subscribe(
      (response: any) => {
        this.niftyNextUploaded = true;
        this.upldFiles.next = response;
      },
      (error) => {
        this.niftyNextUploaded = false;
        console.error('Error uploading file:', error);
      }
    );
  }
  onFDateFileSelected(event: any): void {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.http.post('http://localhost:8080/uploadone', formData).subscribe(
      (response: any) => {
        this.fDateUploaded = true;
        this.upldFiles.fDate = response;
      },
      (error) => {
        this.fDateUploaded = false;
        console.error('Error uploading file:', error);
      }
    );
  }
  onSecDateFileSelected(event: any): void {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.http.post('http://localhost:8080/uploadone', formData).subscribe(
      (response: any) => {
        this.sDateUploaded = true;
        this.upldFiles.sDate = response;
      },
      (error) => {
        this.sDateUploaded = false;
        console.error('Error uploading file:', error);
      }
    );
  }
  generate(): void {
    console.log(this.upldFiles);
    this.upldFiles.nifty.forEach((nifty: any) => {
      let foundRec1 = this.upldFiles.fDate.find(
        (bq1: any) => bq1.SYMBOL == nifty.Symbol
      );
      let foundRec2 = this.upldFiles.sDate.find(
        (bq2: any) => bq2.SYMBOL == nifty.Symbol
      );
      if (foundRec1 && foundRec2) {
        nifty.breaked =
          foundRec2.DELIV_PER > foundRec1.DELIV_PER ? true : false;
      }
      this.change(nifty);
    });
    this.upldFiles.next.forEach((nifty: any) => {
      let foundRec1 = this.upldFiles.fDate.find(
        (bq1: any) => bq1.SYMBOL == nifty.Symbol
      );
      let foundRec2 = this.upldFiles.sDate.find(
        (bq2: any) => bq2.SYMBOL == nifty.Symbol
      );
      if (foundRec1 && foundRec2) {
        nifty.breaked =
          foundRec2.DELIV_PER > foundRec1.DELIV_PER ? true : false;
      }
      this.change(nifty);
    });
    this.FinalDataSet=[];
    this.FinalDataSet.push(
      ...this.upldFiles.next.filter((el: any) => el.breaked == true)
    );
    this.FinalDataSet.push(
      ...this.upldFiles.nifty.filter((el: any) => el.breaked == true)
    );
    console.log(this.FinalDataSet);
  }
  change(jsonWithSpaces: any): void {
    for (const key in jsonWithSpaces) {
      if (jsonWithSpaces.hasOwnProperty(key)) {
        const newKey = key.replace(/\s+/g, '_'); // Replace spaces with underscores
        if (key !== newKey) {
          jsonWithSpaces[newKey] = jsonWithSpaces[key];
          delete jsonWithSpaces[key];
        }
      }
    }
  }
}
class filesObj {
  nifty: any = '';
  next: any = '';
  fDate: any = '';
  sDate: any = '';
}
