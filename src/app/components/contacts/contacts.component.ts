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
    public firstName = '';
    public lastName = '';
    public email = '';
    public phone = '';
    public newUser = false;
    public hovered = false;

    constructor(
        public contactService: ContactService,
    ) { }

    public ngOnInit(): void {
        this.generateContactList();
    }

    public drop(event: CdkDragDrop<Array<string>>) {
        moveItemInArray(this.contacts, event.previousIndex, event.currentIndex);
        console.log(this.contacts[event.currentIndex - 1].sequence)
        if (this.contacts[event.previousIndex - 1].sequence === undefined) {
            console.log('?')
        }
        const patchedContact: IContacts = {
            firstName: this.contacts[event.currentIndex].firstName,
            lastName: this.contacts[event.currentIndex].lastName,
            email: this.contacts[event.currentIndex].email,
            phone: this.contacts[event.currentIndex].phone,
            sequence: this.contacts[event.currentIndex - 1].sequence + 1
        };

        this.contactService.editContact(this.contacts[event.currentIndex].id, patchedContact).subscribe((response) => {
            console.log(response)
        });
    }

    public generateContactList(): void {
        this.contactService.getAllContacts().subscribe((response) => {
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
            sequence: 0
        };

        this.contactService.addNewContact(newContact).subscribe((response) => {
            this.generateContactList();
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.phone = '';
            this.newUser = false;
        });
    }

    public deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe((response) => {
        this.generateContactList();
    });
}
}
