console.log('colient side js is loaded')

// fetch('http://localhost:3000/weather?address=!').then((response)=>{
//     response.json().then((data)=>{
//         if(data.error){
//             return console.log(data)
//         }
//         console.log(data.location)
//         console.log(data.summary)
//     })
// })

const weatherForm = document.querySelector('button')
const search = document.querySelector('input')
const p1 = document.querySelector('#msg1')
const p2 = document.querySelector('#msg2')

weatherForm.addEventListener('click',(e)=>{
    e.preventDefault();
    p1.textContent = 'Loading...'
    p2.textContent = ''
    const location = search.value
    const url = '/weather?address='+location

        fetch(url).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                return p1.textContent = data.error;
                // return console.log(data)
            }
            p1.textContent = data.location
            p2.textContent = data.summary +' with a temperature of ' +data.temperature
            console.log(data.summary)
        })
    })
})

