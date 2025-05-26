
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  rating: number;
  images: string[];
  amenities: string[];
  pricePerNight: number;
  currency: string;
  suites: Suite[];
}

export interface Suite {
  id: string;
  name: string;
  description: string;
  images: string[];
  rooms: Room[];
  amenities: string[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  images: string[];
  amenities: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  suiteId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dateOfBirth?: Date;
  phone?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read: boolean;
  userId?: string;
}
