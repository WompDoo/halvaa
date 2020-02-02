import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IContacts } from '../interfaces/contacts';


interface Response {
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    constructor(private http: HttpClient) { }

    public getAllContacts(): Observable<Response> {
        const url: string = environment.apiLink + '/Contacts';

        return this.http.get<Response>(url);
    }

    public addNewContact(newContact: IContacts): Observable<Response> {
        const url: string = environment.apiLink + '/Contacts';

        return this.http.post<Response>(url, newContact);
    }

    public deleteContact(id: number): Observable<Response> {
        const url: string = environment.apiLink + '/Contacts/' + id;

        return this.http.delete<Response>(url);
    }

}
