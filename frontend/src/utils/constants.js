export const CATEGORIES = [
  'Smartphones & Tablets',
  'Laptops & Computers',
  'TVs & Monitors',
  'Audio & Speakers',
  'Cameras & Accessories',
  'Printers & Scanners',
  'Networking Equipment',
  'Gaming Consoles',
  'Kitchen Appliances',
  'Other Electronics',
];

export const CONDITIONS = [
  'Working - Like New',
  'Working - Good',
  'Working - Fair',
  'For Parts / Not Working',
];

export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
