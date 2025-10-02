import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { room } from '../../../../models/room';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [DialogModule, FormsModule],
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
    description: ''
  };

  closeDialog() {
    this.visible = false;
    this.closeAddRoom.emit(undefined);
  }

  addRoom() {
    if (this.room.number && this.room.type && this.room.price && this.room.description) {
      this.closeAddRoom.emit(this.room);
      this.visible = false;
    }
  }
}