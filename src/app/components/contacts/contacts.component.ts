import { IContacts } from './../../interfaces/contacts';
import { ContactService } from './../../services/contact.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    public form: FormGroup;

    public contacts: Array<IContacts>;
    public newUser = false;
    public editUser = false;
    public contactHeading: string;
    public edit: Array<number> = [];

    /* public stuff = [
        {
            id: 0,
            firstName: 'Peep',
            lastName: 'Meep',
            fullName: 'Peep Meep',
            email: 'pmeep@email.com',
            phone: '54545544',
            sequence: 0
        },
        {
            id: 1,
            firstName: 'Peep1',
            lastName: 'Meep1',
            fullName: 'Peep Meep1',
            email: 'pmeep1@email.com',
            phone: '54545544',
            sequence: 500
        },
        {
            id: 2,
            firstName: 'Peep2',
            lastName: 'Meep2',
            fullName: 'Peep Meep2',
            email: 'pmeep2@email.com',
            phone: '54545544',
            sequence: 4000
        },
        {
            id: 3,
            firstName: 'Peep3',
            lastName: 'Meep3',
            fullName: 'Peep Meep3',
            email: 'pmeep3@email.com',
            phone: '54545544',
            sequence: 800
        }
    ] */

    constructor(
        public contactService: ContactService,
        private readonly fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            firstName: [''],
            lastName: [''],
            phone: [''],
            email: [''],
            sequence: [0],
            id: [0],
        });
    }

    public ngOnInit(): void {
        this.generateContactList();
    }

    public drop(event: CdkDragDrop<Array<string>>) {
        moveItemInArray(this.contacts, event.previousIndex, event.currentIndex);
        console.log(event.previousIndex, event.currentIndex)
        let sequence = 0;
        if (event.currentIndex !== 0) {
            sequence = this.contacts[event.currentIndex - 1].sequence + 1;
        }
        console.log(sequence)
        const patchedContact: IContacts = {
            firstName: this.contacts[event.currentIndex].firstName,
            lastName: this.contacts[event.currentIndex].lastName,
            email: this.contacts[event.currentIndex].email,
            phone: this.contacts[event.currentIndex].phone,
            sequence
        };

        this.contactService.editContact(this.contacts[event.currentIndex].id, patchedContact).subscribe((response) => {
            console.log(response)
        });
    }

    public generateContactList(): void {
        this.contactHeading = 'Add new contact';
        this.contactService.getAllContacts().subscribe((response) => {
            this.contacts = response.data;
        });
    }

    public newContact(): void {
        const newContact: IContacts = {
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            email: this.form.get('email').value,
            phone: this.form.get('phone').value,
            sequence: 0
        };

        this.contactService.addNewContact(newContact).subscribe((response) => {
            this.generateContactList();
            this.newUser = false;
        });
    }

    public submitEditContact(id: number): void {
        const patchedContact: IContacts = {
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            email: this.form.get('email').value,
            phone: this.form.get('phone').value,
            sequence: this.form.get('sequence').value
        };

        console.log(this.form.get('id').value)
        this.contactService.editContact(this.form.get('id').value, patchedContact).subscribe((response) => {
            this.generateContactList();
            this.editUser = false;
            this.editContact(id);
        });
    }

    public deleteContact(id: number): void {
        this.contactService.deleteContact(id).subscribe((response) => {
            this.generateContactList();
        });
    }

    public createContact(id: number): void {
        const contact = this.contacts[id];
        console.log(contact)
        this.form.setValue({
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            sequence: contact.sequence,
            id: contact.id
        });
        console.log(this.form.value)
    }

    public editContact(inputIndex: number): void {
        console.log(inputIndex)
        this.contactHeading = 'Edit contact';
        if (this.edit) {
            if (this.edit.indexOf(inputIndex) === -1) {
                console.log('jah')
                this.editUser = true;
                this.edit.push(inputIndex);
                this.createContact(inputIndex);
            } else {
                console.log('ei')
                this.editUser = false;
                this.edit.splice(this.edit.indexOf(inputIndex), 1);
            }
        } else {
            this.edit = [inputIndex];
        }
        console.log(this.edit)
    }
}
