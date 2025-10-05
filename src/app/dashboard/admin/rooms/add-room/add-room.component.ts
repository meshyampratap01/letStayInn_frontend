import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { room } from '../../../../models/room';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [DialogModule, FormsModule, DropdownModule, CommonModule],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss',
})
export class AddRoomComponent {
  @Output() closeAddRoom = new EventEmitter<room>();
  visible = true;


  room: room = {
    number: 0,
    type: '',
    price: 0,
    is_available: true,
    description: '',
  };

  roomTypeOptions = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Deluxe', value: 'Deluxe' },
    { label: 'Suite', value: 'Suite' },
    { label: 'Executive', value: 'Executive' },
  ];

  closeDialog() {
    this.visible = false;
    this.closeAddRoom.emit(undefined);
  }

  addRoom() {
    console.log(this.room);
    if (
      this.room.number > 0 &&
      this.room.type &&
      this.room.price > 0 &&
      this.room.description
    ){
      this.closeAddRoom.emit(this.room);
      this.visible = false;
    }
  }
}
