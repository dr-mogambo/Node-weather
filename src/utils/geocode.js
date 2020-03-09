const request = require ('request')

const geocode = (address,callback)=>{
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1IjoibW9oc2lubWQiLCJhIjoiY2s3aDg0dXpkMDc2bzNrbzh1M2d1MGpoOSJ9.VucKj3BN1_lblUZjWFT4zw&limit=1'

    request({url:url,json:true},(error,response)=>{
        if (error){
            callback('unable to connect to location services',undefined)

        }else if(response.body.features.length ===0){
            callback('unable to find the location',undefined)
        }else{
            callback(undefined,{
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

const weatherRequest  = (lat,long,callback)=>{
    const url = 'https://api.darksky.net/forecast/d32d7c5b3bedb367d5b82c58e3561406/'+encodeURIComponent(lat) +','+ encodeURIComponent(long)+'?units=si'

    request({url:url,json:true},(error,response)=>{
        if(error){
            callback('unable to connect',undefined)
        }else if(response.body.error){
            callback('unable to find the location',undefined)
        }else{
            callback(undefined, response.body.currently)
        }
    })
}

// geocode('{}}',(error,response)=>{
//     console.log(error)
//     // console.log(response.body.features[0].place_name)
// })
module.exports= {geocode:geocode,
                 weatherRequest:weatherRequest
                }

