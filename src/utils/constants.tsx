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

export const numberOfCorrespondingPoints = 5;
export const commonCircleStyleProps = {
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.35,
  radius: 2000,
}
export const defaultValueFormat = "0[.]00"