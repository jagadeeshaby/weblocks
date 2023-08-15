export default function middleware (name){

        function invoke(params){
            return fetch(params.api, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
        }
        return {
            invoke: invoke
        }

    }


