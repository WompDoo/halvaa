import { IContacts } from './../../interfaces/contacts';
import { ContactService } from './../../services/contact.service';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    public contacts: Array<IContacts>;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public newUser = false;
    public hovered = false;
    public rndList = [
        {
            firstName: 'this.firstName',
            lastName: 'this.lastName',
            email: 'this.email',
            phone: 'this.phone',
            sequence: 9000
        },
        {
            firstName: 'this.firstName1',
            lastName: 'this.lastName1',
            email: 'this.email',
            phone: 'this.phone',
            sequence: 9000
        },
        {
            firstName: 'this.firstName2',
            lastName: 'this.lastName2',
            email: 'this.email',
            phone: 'this.phone',
            sequence: 9000
        },
        {
            firstName: 'this.firstName3',
            lastName: 'this.lastName3',
            email: 'this.email',
            phone: 'this.phone',
            sequence: 9000
        },
    ]


    constructor(
        public contactSerivce: ContactService,
    ) { }

    public ngOnInit(): void {
        this.generateContactList();
    }

    public drop(event: CdkDragDrop<Array<string>>) {
        console.log(event)
        moveItemInArray(this.contacts, event.previousIndex, event.currentIndex);
    }

    public generateContactList(): void {
        this.contactSerivce.getAllContacts().subscribe((response) => {
            console.log(response.data);
            this.contacts = response.data;
        });
    }

    public newContact(): void {
        const newContact: IContacts = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            sequence: 9000
        };

        this.contactSerivce.addNewContact(newContact).subscribe((response) => {
            this.generateContactList();
        });
    }

    public deleteContact(id: number): void {
        this.contactSerivce.deleteContact(id).subscribe((response) => {
            this.generateContactList();
        });
    }
}
