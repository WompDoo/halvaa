import { IContacts } from './../../interfaces/contacts';
import { ContactService } from './../../services/contact.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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

    constructor(
        public contactService: ContactService,
        private readonly fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])],
            sequence: [0],
            id: [0],
        });
    }

    public ngOnInit(): void {
        this.generateContactList();
    }

    public createContact() {
        this.newUser = true;
        this.form.reset();

    }

    public drop(event: CdkDragDrop<Array<string>>) {
        moveItemInArray(this.contacts, event.previousIndex, event.currentIndex);

        let index = 0;

        for (const contact of this.contacts) {
            index++;
            contact.sequence = index - 1;
            this.contactService.editContact(contact.id, contact).subscribe((response) => {
            });
        }
        this.generateContactList();
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
            this.form.updateValueAndValidity();
            this.generateContactList();
            this.newUser = false;
        });
    }

    public submitEditContact(): void {
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
            this.editContact(this.form.get('id').value);
        });
    }

    public deleteContact(id: number): void {
        this.contactService.deleteContact(id).subscribe((response) => {
            this.generateContactList();
        });
    }

    public setFormContact(id: number): void {
        for (const contact of this.contacts) {
            if (contact.id === id) {
                this.form.setValue({
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    phone: contact.phone,
                    sequence: contact.sequence,
                    id: contact.id
                });
            }
        }
    }

    public editContact(inputIndex: number): void {
        this.contactHeading = 'Edit contact';
        if (this.edit) {
            if (this.edit.indexOf(inputIndex) === -1) {
                this.editUser = true;
                this.edit.push(inputIndex);
                this.setFormContact(inputIndex);
            } else {
                this.editUser = false;
                this.edit.splice(this.edit.indexOf(inputIndex), 1);
            }
        } else {
            this.edit = [inputIndex];
        }
    }
}
