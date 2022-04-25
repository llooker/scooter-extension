import {startCase, toLower} from 'lodash'

export const titleCaseHelper = (str) => {
  return startCase(toLower(str));
}

export const lowerCaseHelper = (str) => {
  return toLower(str)
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
    if (dataCopy[0].hasOwnProperty(sortValue)){
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
    } else return data;
  } 
}

export const technicianToPoint = (technicianArr) => {

  if(technicianArr){
      //keys from technician table
      const technicianID = Object.keys(technicianArr[0])[0]
      const technicianFullName = Object.keys(technicianArr[0])[1]
      const technicianLatCoord = Object.keys(technicianArr[0])[3]
      const technicianLngCoord = Object.keys(technicianArr[0])[4]
      const technicianLevel = Object.keys(technicianArr[0])[5]
      const technicianPhoneNumber = Object.keys(technicianArr[0])[6]
      const technicianStatus = Object.keys(technicianArr[0])[7]

      //format technician data to get passed into google maps api
      const returnArr = []
      technicianArr.map((item) => {
        returnArr.push({id: item[technicianID].value,
                        type: "technician",
                        position: new google.maps.LatLng(parseFloat(item[technicianLatCoord].value), parseFloat(item[technicianLngCoord].value)),
                        name: item[technicianFullName].value,
                        level: item[technicianLevel].value,
                        phoneNum: item[technicianPhoneNumber].value,
                        status: item[technicianStatus].value,
                      })
      })
      return returnArr
  }else return undefined;
}

export const scooterToPoint = (scooterArr) => {
  // console.log("scooterToPoint")
  // console.log({scooterArr})
  if (scooterArr){
    //keys from scooter table
    const scooterID = Object.keys(scooterArr[0])[0]
    const scooterLatCoord = Object.keys(scooterArr[0])[1]
    const scooterLngCoord = Object.keys(scooterArr[0])[2]
    const scooterLastBattery = Object.keys(scooterArr[0])[4]
    const scooterDaysSinceLastService = Object.keys(scooterArr[0])[5]

    //format scooter data to get passed into google maps api
    const returnArr = []
    scooterArr.map((item) => {
      returnArr.push({ id: item[scooterID].value,
        type: "scooter",
        position: new google.maps.LatLng(parseFloat(item[scooterLatCoord].value), parseFloat(item[scooterLngCoord].value)),
        battery: item[scooterLastBattery].value,
        daysSinceService: item[scooterDaysSinceLastService].value,
      })
    })
    return returnArr;
  } else return undefined;
}

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

// export const computeDirections = async ({correspondingArray, correspondingPartialKey, latOfInterest, lngOfInterest}) => {
export const computeDirections = async ({technicianData, scooterToServiceLat, scooterToServiceLng}) => {
  // console.log("computeDirections")
  // console.log({technicianData})
  // console.log({scooterToServiceLat})
  // console.log({scooterToServiceLng})

  const technicianDataWithDuration = await technicianData.map(async item => {
    const technicianLat = item["technicians.last_lat_coord"].value
    const technicianLng = item["technicians.last_lng_coord"].value

    var service = new google.maps.DistanceMatrixService();
    const resp = await service.getDistanceMatrix(
    {
      origins: [{lat: technicianLat, lng: technicianLng}],
      destinations: [{lat: scooterToServiceLat, lng: scooterToServiceLng}],
      travelMode: 'DRIVING',
      avoidHighways: true,
      avoidTolls: true,
      unitSystem: google.maps.UnitSystem.IMPERIAL   
    });

    const distance = resp["rows"][0]["elements"][0]["distance"]
    const duration = resp["rows"][0]["elements"][0]["duration"]
      return {...item, 
        ["technicians.distance"]: distance,
        ["technicians.duration"]: duration,
      }
  })
  return technicianDataWithDuration
}