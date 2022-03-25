import { faMotorcycle, faUserGear } from '@fortawesome/free-solid-svg-icons'

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


export const mapColors = {
  blue: "#1a73e8",
  red: "#FF0000"
}

//from here: https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-custom
const scooterMarker = {
  path: "M 7.82 16 H 15 v -1 c 0 -2.21 1.79 -4 4 -4 h 0.74 l -1.9 -8.44 A 2.009 2.009 0 0 0 15.89 1 H 12 v 2 h 3.89 l 1.4 6.25 h -0.01 A 6.008 6.008 0 0 0 13.09 14 H 7.82 a 2.996 2.996 0 0 0 -3.42 -1.94 c -1.18 0.23 -2.13 1.2 -2.35 2.38 A 3.002 3.002 0 0 0 5 18 c 1.3 0 2.4 -0.84 2.82 -2 Z M 5 16 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 s 1 0.45 1 1 s -0.45 1 -1 1 Z M 19 12 c -1.66 0 -3 1.34 -3 3 s 1.34 3 3 3 s 3 -1.34 3 -3 s -1.34 -3 -3 -3 Z m 0 4 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 s 1 0.45 1 1 s -0.45 1 -1 1 Z",
  fillColor: mapColors.red,
  fillOpacity: 1,
  strokeWeight: 1,
  scale: 1,
}

const technicianMarker = {
  path: "M 610.5 373.3 c 2.6 -14.1 2.6 -28.5 0 -42.6 l 25.8 -14.9 c 3 -1.7 4.3 -5.2 3.3 -8.5 c -6.7 -21.6 -18.2 -41.2 -33.2 -57.4 c -2.3 -2.5 -6 -3.1 -9 -1.4 l -25.8 14.9 c -10.9 -9.3 -23.4 -16.5 -36.9 -21.3 v -29.8 c 0 -3.4 -2.4 -6.4 -5.7 -7.1 c -22.3 -5 -45 -4.8 -66.2 0 c -3.3 0.7 -5.7 3.7 -5.7 7.1 v 29.8 c -13.5 4.8 -26 12 -36.9 21.3 l -25.8 -14.9 c -2.9 -1.7 -6.7 -1.1 -9 1.4 c -15 16.2 -26.5 35.8 -33.2 57.4 c -1 3.3 0.4 6.8 3.3 8.5 l 25.8 14.9 c -2.6 14.1 -2.6 28.5 0 42.6 l -25.8 14.9 c -3 1.7 -4.3 5.2 -3.3 8.5 c 6.7 21.6 18.2 41.1 33.2 57.4 c 2.3 2.5 6 3.1 9 1.4 l 25.8 -14.9 c 10.9 9.3 23.4 16.5 36.9 21.3 v 29.8 c 0 3.4 2.4 6.4 5.7 7.1 c 22.3 5 45 4.8 66.2 0 c 3.3 -0.7 5.7 -3.7 5.7 -7.1 v -29.8 c 13.5 -4.8 26 -12 36.9 -21.3 l 25.8 14.9 c 2.9 1.7 6.7 1.1 9 -1.4 c 15 -16.2 26.5 -35.8 33.2 -57.4 c 1 -3.3 -0.4 -6.8 -3.3 -8.5 l -25.8 -14.9 Z M 496 400.5 c -26.8 0 -48.5 -21.8 -48.5 -48.5 s 21.8 -48.5 48.5 -48.5 s 48.5 21.8 48.5 48.5 s -21.7 48.5 -48.5 48.5 Z M 224 256 c 70.7 0 128 -57.3 128 -128 S 294.7 0 224 0 S 96 57.3 96 128 s 57.3 128 128 128 Z m 201.2 226.5 c -2.3 -1.2 -4.6 -2.6 -6.8 -3.9 l -7.9 4.6 c -6 3.4 -12.8 5.3 -19.6 5.3 c -10.9 0 -21.4 -4.6 -28.9 -12.6 c -18.3 -19.8 -32.3 -43.9 -40.2 -69.6 c -5.5 -17.7 1.9 -36.4 17.9 -45.7 l 7.9 -4.6 c -0.1 -2.6 -0.1 -5.2 0 -7.8 l -7.9 -4.6 c -16 -9.2 -23.4 -28 -17.9 -45.7 c 0.9 -2.9 2.2 -5.8 3.2 -8.7 c -3.8 -0.3 -7.5 -1.2 -11.4 -1.2 h -16.7 c -22.2 10.2 -46.9 16 -72.9 16 s -50.6 -5.8 -72.9 -16 h -16.7 C 60.2 288 0 348.2 0 422.4 V 464 c 0 26.5 21.5 48 48 48 h 352 c 10.1 0 19.5 -3.2 27.2 -8.5 c -1.2 -3.8 -2 -7.7 -2 -11.8 v -9.2 Z",
  fillColor: mapColors.blue,
  fillOpacity: 1,
  strokeWeight: 1,
  scale: .0375,
}

export const markers = {
  scooter: scooterMarker, 
  technician: technicianMarker
}