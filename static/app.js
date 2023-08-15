
import ApiMiddleWare from "./apiMiddleware.js";
import "./eventSource.js";

const sampleAppMiddleware = new ApiMiddleWare("SampleApp");

console.log(sampleAppMiddleware);

const bc = new BroadcastChannel("apiChannel");

document.getElementById("invoke").addEventListener("click", async () => {
    handleInvoke();
    // const state = await navigator.locks.query();
    // const master = state.held.find((lock) => lock.name === "lock-api-process");
    // if(master){
    //     handleInvoke();
    // }else{
    //     bc.postMessage("This is a test message.");
    // }
});   


function handleInvoke(){
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerText = "Loading......"
    sampleAppMiddleware.invoke({name: "Jag", location: location.href, api: "/api"}).then(async data => {
        if(data.ok){
            let res  = await data.json();
            document.getElementById("result").innerText = JSON.stringify(res,null, "\t");
        }else{
            document.getElementById("result").innerText = `${data.statusText} - ${data.status}`;
        }
    }).catch((e) => {
        document.getElementById("result").innerText = e;
    });
}


navigator.locks.request(`lock-api-process`,  (lock) => {
    const p2 = new Promise(r => {
        // Logic to use lock and resolve promise...
        console.log("API Master");

        bc.onmessage = (event) => {
            console.log(event);
            handleInvoke();
        };
        // r();
      });

      return p2;
});
