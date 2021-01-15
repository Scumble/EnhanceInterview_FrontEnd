import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '@app/../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
	public onUploadFinished = new EventEmitter();

	constructor(private http: HttpClient) {
	
	}

	public uploadFile(files: any): Observable<any> {
		if (files.length === 0) {
			return;
		  }
	  
		let fileToUpload = <File>files[0];
		const formData = new FormData();
		formData.append('file', fileToUpload, fileToUpload.name);
	  
		return this.http.post(`${environment.apiUrl}/upload`, formData, {reportProgress: true, observe: 'events'})
	}
}