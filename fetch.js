console.log("running")

//async function to fetch from url and convert to json
async function fetchAndConvertToJson(url){

    const response = await fetch(url);
    
    if(response.ok==false){
        console.log("shit sumtingwong");
    } else {
        const json= await response.json();
        
        return json;
    }

}

async function processing(currentStop,targetRoute,routeSequence){
    //find the target Route and it's route ID
    let targetRouteID
    let json = await fetchAndConvertToJson('https://data.etagmb.gov.hk/route/NT/'+targetRoute)
    targetRouteID=json['data'][0]['route_id']
    console.log('routeID of '+targetRoute+' found as: '+targetRouteID)


    let stopID = undefined;
    let url=`https://data.etagmb.gov.hk/route-stop/${targetRouteID}/${routeSequence}`
    let json1 = await fetchAndConvertToJson(url)

    for(const element of json1["data"]["route_stops"]){
        console.log('searching: '+element["name_sc"])
        if(element['name_sc'].includes(currentStop)){
            stopID=element['stop_id'];
            break;
       }
    }
    if (!stopID) {
        console.log("cannot find this stop in this route")
    } else {
        console.log("the stop ID of "+currentStop+" is " +stopID)
    }
    
    //find ETA
    let json2=await fetchAndConvertToJson(`https://data.etagmb.gov.hk/eta/route-stop/${targetRouteID}/${stopID}`)
    //console.log(json2['data'][0]['eta'])
    let i = 0;
    for (element of json2['data'][0]['eta']){
        const displayValue = `${element['diff']} min 分钟`
        console.log("incoming buses: "+displayValue)
        document.getElementById(`bus${i}`).innerHTML = displayValue
        i++;
    }
}   

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("query").addEventListener('click', () => {
        const stopname = document.getElementById("stopname").value;
        const routename = document.getElementById("routename").value;
        const direction = Number(document.getElementById("direction").value);
        processing(stopname, routename, direction);
    })

})













