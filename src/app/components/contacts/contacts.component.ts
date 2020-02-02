import { IContacts } from './../../interfaces/contacts';
import { ContactService } from './../../services/contact.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(
    public contactSerivce: ContactService,
  ) { }

  public ngOnInit(): void {
    this.generateContactList();
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
