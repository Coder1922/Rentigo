export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  zip?: string;
  license?: string;
  role: 'admin' | 'agency' | 'customer';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: '2-Wheeler' | '4-Wheeler';
  year: number;
  fuelType: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
  transmission: 'Automatic' | 'Manual';
  rateDay: number;
  rateWeek: number;
  rateMonth: number;
  status: 'Available' | 'Rented' | 'Maintenance';
  plateNo: string;
  agencyId: string;
  agencyName: string;
  image: string;
  approved: boolean;
  maintenanceBlocked: boolean;
  notes?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  fuelType: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  agencyId: string;
  dateSubmitted: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleName: string;
  plateNo: string;
  vehicleImage: string;
  serviceType: string;
  priority: 'routine' | 'medium' | 'critical';
  serviceDate: string;
  estimatedCost: number;
  location: string;
  description: string;
  status: 'Scheduled' | 'In Progress' | 'Overdue';
}

export interface Agency {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  fleetSize: string;
  taxId: string;
  tier: 'Premium' | 'Standard';
  status: 'Verified' | 'Pending' | 'Suspended';
  avatar?: string;
}

export interface PricingClass {
  name: string;
  baseDay: number;
  rateWeekDiscount: number;
  rateMonthDiscount: number;
  units: number;
  active: boolean;
  category: string;
}

export interface PricingRule {
  id: string;
  name: string;
  surgePercent: number;
  startDate: string;
  endDate: string;
  applicableClass: string;
  active: boolean;
  iconName: 'calendar_month' | 'celebration' | 'trending_up';
  notes: string;
}

export interface SystemAlert {
  id: string;
  type: 'unauthorized' | 'purge' | 'lag' | 'info' | 'warning';
  title: string;
  message: string;
  dateSubmitted: string;
}
