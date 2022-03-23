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
export const commonCircleStyleProps = {
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.35,
  radius: 2000,
}
export const defaultValueFormat = "0[.]00"
export const mapColors = {
  blue: "#1a73e8",
  red: "#FF0000"
}

export const technicianColumnsToRender = ["technicians.id",
  "technicians.first_name",
  "technicians.last_name",
  "technicians.email",
  "technicians.level",
  "technicians.phone_number",
  "technicians.status",
  "technicians.distance",
  "technicians.duration",
];

export const scooterColumnsToRender = ["scooters.id",  
"scooters.last_reported_battery", 
"scooters.days_since_last_service", 
"scooters.status"
]