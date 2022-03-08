import {startCase, toLower} from 'lodash'

export const titleCaseHelper = (str) => {
  return startCase(toLower(str));
}

export const    calculateDistance = (lat1, lon1, lat2, lon2, unit) => {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}

export const sortHelper = ({data, sortOrder, sortValue})=>{
  // console.log("sortHelper")
  // console.log({data, sortOrder, sortValue})
  if (data && sortOrder && sortValue){
    const dataCopy = [...data]
    if (sortOrder === "ASC"){
      dataCopy.sort((a, b) => {   
        if (typeof a[`${sortValue}`].value === 'string'){
          const valueA = toLower(a[`${sortValue}`].value);
          const valueB = toLower(b[`${sortValue}`].value);
          if (valueA < valueB) return -1
          if (valueA > valueB) return 1
          return 0
        } else {
          return ([a[`${sortValue}`].value - b[`${sortValue}`].value])
        }
      })
    } else {
      dataCopy.sort((a, b) => {
        if (typeof a[`${sortValue}`].value === 'string'){
          const valueA = toLower(a[`${sortValue}`].value);
          const valueB = toLower(b[`${sortValue}`].value);
          if (valueA < valueB) return 1
          if (valueA > valueB) return -1
          return 0
        } else {
          return ([b[`${sortValue}`].value - a[`${sortValue}`].value] )
        }
      })
    }
    return dataCopy
  }
  
}

export const technicianToPoint = ({technicianData}) => {

      //keys from technician table
      const technicianID = Object.keys(technicianData[0])[0]
      const technicianFirstName = Object.keys(technicianData[0])[1]
      const technicianLastName = Object.keys(technicianData[0])[2]
      const technicianLatCoord = Object.keys(technicianData[0])[4]
      const technicianLngCoord = Object.keys(technicianData[0])[5]
      const technicianLevel = Object.keys(technicianData[0])[6]
      const technicianPhoneNumber = Object.keys(technicianData[0])[7]
      const technicianStatus = Object.keys(technicianData[0])[8]

      //format technician data to get passed into google maps api
      const returnArr = []
      technicianData.map((item) => {
        returnArr.push({id: item[technicianID].value,
                        type: "technician",
                        position: new google.maps.LatLng(parseFloat(item[technicianLatCoord].value), parseFloat(item[technicianLngCoord].value)),
                        name: `${item[technicianFirstName].value} ${item[technicianLastName].value}`,
                        level: item[technicianLevel].value,
                        phoneNum: item[technicianPhoneNumber].value,
                        status: item[technicianStatus].value
                      })
      })

      return returnArr
}

export const scooterToPoint = ({scooterData}) => {
  //keys from scooter table
  const scooterID = Object.keys(scooterData[0])[0]
  const scooterLatCoord = Object.keys(scooterData[0])[1]
  const scooterLngCoord = Object.keys(scooterData[0])[2]
  const scooterLastBattery = Object.keys(scooterData[0])[4]
  const scooterDaysSinceLastService = Object.keys(scooterData[0])[5]

  //format scooter data to get passed into google maps api
  const returnArr = []
  scooterData.map((item) => {
    returnArr.push({ id: item[scooterID].value,
      type: "scooter",
      position: new google.maps.LatLng(parseFloat(item[scooterLatCoord].value), parseFloat(item[scooterLngCoord].value)),
      battery: item[scooterLastBattery].value,
      daysSinceService: item[scooterDaysSinceLastService].value})
  })
  return returnArr;
}