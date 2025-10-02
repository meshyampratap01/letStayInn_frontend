import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { room } from '../../../models/room';
import { ButtonModule } from 'primeng/button';
import { AddRoomComponent } from './add-room/add-room.component';
import { RoomService } from '../../../service/room.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-rooms',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    AddRoomComponent,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    TextareaModule,
    ProgressBarModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  private roomService = inject(RoomService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  isLoading = false;
  visible = false;

  roomType: string[];

  roomToEdit: room = {
    number: 0,
    price: 0,
    type: '',
    is_available: true,
    description: '',
  };

  rooms: room[] = [];

  viewAddRoomDialog = false;

  constructor() {
    this.roomService.rooms.subscribe({
      next: (val) => {
        this.rooms = val;
      },
    });
    this.roomType = ['Deluxe', 'Standard', 'Suite', 'Executive'];
  }

  onClickAddRoom() {
    this.viewAddRoomDialog = true;
  }

  onCloseAddRoom(event: room) {
    if (event == undefined) {
      this.viewAddRoomDialog = false;
    } else {
      this.isLoading = true;
      this.roomService.addRoom(event).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            closable: true,
            summary: 'Added Room Successfully!',
            detail: res.message,
            life: 4000,
          });
          this.viewAddRoomDialog = false;
          this.roomService.loadRooms().subscribe();
        },
        error: (res) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Some error Occured!',
            detail: res.message,
            life: 3000,
          });
        },
      });
    }
  }

  onSelectDeleteRoom(event: Event, roomNum: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Delete Room with room number ${roomNum}?`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        this.isLoading = true;
        this.roomService.deleteRoom(roomNum).subscribe({
          next: (res) => {
            this.roomService.loadRooms().subscribe();
            this.isLoading = false;
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: res.message,
            });
          },
          error: (res) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Some error Occured!',
              detail: res.message,
              life: 3000,
            });
          },
        });
      },
      reject: () => {},
    });
  }

  onSelectEditRoom(room: room) {
    this.visible = true;
    this.roomToEdit = room;
  }

  updateRoom() {
    this.isLoading=true;
    this.roomService.updateRoom(this.roomToEdit).subscribe({
      next: (res) => {
        this.roomService.loadRooms().subscribe();
        this.isLoading=false;
        this.messageService.add({
          severity: 'info',
          summary: `Room ${this.roomToEdit.number} updated!`,
          detail: res.message,
        });
        this.visible = false;
      },
      error: (res) => {
        this.isLoading=false;
        this.messageService.add({
          severity: 'error',
          summary: 'Some error Occured!',
          detail: res.message,
          life: 3000,
        });
        this.visible = false;
      },
    });
  }
}
