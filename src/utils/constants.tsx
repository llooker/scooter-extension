const iconBase =
"https://developers.google.com/maps/documentation/javascript/examples/full/images/"
export const icons: Record<string, { icon: string }> = {
 parkedScooter: {
   icon: iconBase + "parking_lot_maps.png",
 },
 technician: {
   icon: iconBase + "library_maps.png",
 },
 scooter: {
   icon: iconBase + "info-i_maps.png",
 },
};

export const technicianColumnsToRender = ["technicians.id",
  "technicians.first_name",
  "technicians.last_name",
  "technicians.email",
  "technicians.level",
  "technicians.status",
  "technicians.distance",
  "technicians.duration",
];

export const scooterColumnsToRender = ["scooters.id",  
"scooters.last_reported_battery", 
"scooters.days_since_last_service", 
"scooters.status"
]