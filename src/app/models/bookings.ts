export interface BookingDTO {
  id: string;
  room_num: number;
  status: string;
  food_req: boolean,
  clean_req: boolean,
  checkIn: string;   // formatted as "YYYY-MM-DD"
  checkOut: string;  // formatted as "YYYY-MM-DD"
}

export type getBookingResponse = {
    code: number;
    message: string;
    data: BookingDTO[];
}