import scooterLogo from '../images/Scooter.png'
import technicianLogo from '../images/Technician.png'

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
  "technicians.full_name",
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

export const markers = {
  technician: technicianLogo,
  scooter: scooterLogo
}

export const colors = {
  ui: {
    alternate: '#46DB94',
    darkHover: '#2B10AE',
    hover: '#E5E0FF',
    light: '#F7F7FF',
  },
  text: {
    primary: '#ffffff',
    dark: '#000000',
    hover: '#E5E0FF',
    backdrop: '#5C3BFE'    
  },
  status: {
    primary: '#FFFFFF',
    in_use: '#21AAEA',
    available: '#40C6AD',
    charging: '#21AAEA',
    needs_service: '#E7364F',
    in_service: '#B275E6',
    utilized: '#21AAEA',
    not_working: '#cecece',
    unknown: '#cecece',

  },
  battery:{
    low:  '#E7364F',
    medium: '#FD9900',
    high: '#40C6AD'
  }
}

export const scooterColumnsToRender2 = [
  {key: "scooters.id", label: "ID"}, 
  {key: "scooters.last_reported_battery", label: "Charge"}, 
  {key: "scooters.days_since_last_service", label: "Last Serviced"}, 
  {key: "scooters.status", label: "Status"}, 
]

export const technicianColumnsToRender2 = [
  {key: "technicians.id", label: "ID"}, 
  {key: "technicians.full_name", label: "Name"}, 
  {key: "technicians.email", label: "Email"}, 
  {key: "technicians.level", label: "Level"}, 
  {key: "technicians.distance", label: "distance"}, 
  {key: "technicians.duration", label: "duration"}, 
  {key: "technicians.status", label: "status"}, 
]