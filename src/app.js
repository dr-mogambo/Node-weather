// express library exposes a single function called express, we call it to create a express application one single time below
// we store whats returned by express and store in a variable called app, this app we start to configure by giving various options
// express allows the system to behave like a server and start to respond for different url requests, we do this by setting up routes
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const requestType = require('./utils/geocode')



//$$app.get is what is used to get the request in and send back a response. hence we create routes with the app.get methids

// app.get('', (req,res)=>{
//     res.send('<h1>this is the home page</h1>')
// })

//Express automatically stringifies the object and sends it out
// app.get('/help', (req,res)=>{
//     res.send(
//         '<h1>Help</h1>'
//     )
// })

// app.get('/about', (req,res)=>{
//     res.send('<h1>About</h1>')
// })

// app.get('/weather', (req,res)=>{
//     res.send([
//         {
//         forecast:'It is going to rain',
//         temperature:27,
//         location:'bangalore'
//         }
//     ])
// })



//now we will configure express to serveup an entire directory of assets
//create a directory that will be served up by express, we create a public folder
//to serve up the public directory and static pages node needs to know the complete path to the files
console.log(__filename)
console.log(path.join(__dirname,'../public'))// these 2 variables are provided by that wrapper function which wraps our code and provides bindings before starting the code execution we saw withint the browser
//$$ note how we got the path variable (__dirname) and then used node module path to manipulate and get the absolute path of the public folder
const publicpath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

const app = express()
const port = process.env.PORT||3000

app.set('view engine', 'hbs')
app.set('views',viewsPath)//$$$ we are setting up the views path to where ever we want and not constrained by always putting it in views directory
// $$ in the abocve line we tell express to use the handlebars view engine
//$$$hbs needs to have the dynamic html templates to be setup in a specific location called views
hbs.registerPartials(partialsPath)// notice how we added the path to hbs to set where the partials path will be
//$$$$ notice that eventhough we added the partials path and added a partial the webpage does not render since nodemon does not knnow to handle changes for partials
//$$$$ nodemon by default is just monitoring files with the extension js like app.js, so we start nodemon src/app.js -e js,hbs



// to serve the public directory we need this single line
app.use(express.static(publicpath))
//in above we need to call app.use and within it use the return value of express.static while providing the path which the express needs to serve the static resources from

app.get('', (req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Mohsin'
    })
})// we had deleted these when we were serving static assets, but with handle bars we again added them but with res.render(hbs template name)
//$$ we can pass a second argument to render to allow passing of data from the node to the hbs files

var text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim ad voluptatum placeat et, porro, illo sed dignissimos debitis beatae, ducimus ullam. Repellendus qui harum possimus sequi sit unde magni! Doloribus.'


app.get('/help', (req,res)=>{
    res.render('help', {
        title:"Help",
        text,
        name:'Mohsin'
    })
})

app.get('/about', (req,res)=>{
    res.render('about',{
        title:'About page',
        name:'Mohsin'
    })
})

//$$ in the above we are removing the routes we setup since we are serving the static files from our public directory
//$$$$ now when we connected the css style sheets to our application we added the ./css/styles.css but this is the relative path
//$$$$to use the abseolute path we should start with a /, this backslash will bring us to the root of system, and since in this case the system is the public folder, our absolute path will be /css/styles.css

app.get('/weather', (req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'Address must be provided'
        })
    }
    requestType.geocode(req.query.address,(error,{longitude,latitude,location}={})=>{
        // console.log(error)
        if(error){
            return res.send({
                error
            })
        }
    
        requestType.weatherRequest(latitude,longitude,(error,{summary,temperature,precipProbability})=>{
            if (error){
                return  res.send({
                    error
                })
            }
            
            res.send({
                location,
                summary,
                temperature,
                precipProbability
            })
        })
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'you need to provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title:"Help Aricle not found",
        name:'Mohsin'
    })
})

app.get('*',(req,res)=>{ //the * here means match anything that hasnt been matched so far
    res.render('404', {
        title:"My 404 page",
        name:'Mohsin'
    })
})

///////////////////////////////////////////////////////////////////
//////********setting up dynamic documents**********///////////////
////////////////////////////////////////////////////////////////////
// $$$ we set the view engine, then we add the hbs files and then we set the routes and use res.render() to show the dynamic hbs templates we created
// $$$ handle bars needs the files to be in the views folder by default, we changed it by using app.set('views',path) to use a folder of our choice

///////////////////////////////////////////////////////////////////
//////********setting up partials**********///////////////
////////////////////////////////////////////////////////////////////
//$$$$ note this is the first time we are adding the require hbs, we need to set the hbs to figure out where to find the partials
// after we define the partials path we set hbs to use it for the partials
// now we create partials and use it within the hbs page views we have created, also since nodemon by default only tracks the changes to js, we start it again with an extension of js,hbs
// we created the links within the ppartial header and notice how we setup paths for the anchor tag links

///////////////////////////////////////////////////////////////////
//////********404 page**********///////////////
////////////////////////////////////////////////////////////////////

// we need to start the app.listen just once to start the server and make it to listen to the requests
// we configure it by giving it a port, in general the production servers have default ports
//cntrl+C to close the server
app.listen(port, ()=>{
    console.log('server started on port'+ port)
})


///////////////////////////////////////////////////////////////////
//////********heroku, GIT and Version control**********///////////////
////////////////////////////////////////////////////////////////////
// install heroku, login with command heroku login, and then login with a browser
//untracked files, unstaged changes, staged changes, commits
//git init is used to first create a git reposotory


// Git Status gives us a list of files and their commit status
// we do not want our node modules folder to be tracked with GIT so we create a file called .gitignore and add that folder there
// git Add will add the files we need tracking to be staged
// to add all files to be tracked we type git add .
// we can finally run git commit with a message describing what the change was

///////////////////////////////////////////////////////////////////
//////********Moving code from our machine to Heroku and GIT**********///////////////
////////////////////////////////////////////////////////////////////

//////////////setting up ssh//////////////
// we do this by SSH where 2 pairs of files, we generate these by running few commands from terminal of gitbash and not our local terminal
// we generate the key by running this command
// to see the keys created we use the command $ ls  -l ~/.ssh

// now run the ssh agent eval "$(ssh-agent -s)" (had to run this on git bash for it to work), this will generate a PID. it showed 1997 for me
// now to register the file ssh-add  ~/.ssh/id_rsa (had to run in git bash for this to work)

//////////// pushing to GIT///////////////
//clicked on + and created a repo, then clicked continue and selected push from exiting repo
// now we run the first command git remote add origin https://github.com/dr-mogambo/Node-weather.git
// before we run the enxt command we have to add our ssh key to github
// to get the contents of this ssh key we run the command cat ~/.ssh/id_rsa.pub
// now after adding the ssh public key to github, we will check our connection by running ssh -T git@github.com

// now we can push our code by running the second command git push -u origin master

//////////// pushing to heroku///////////////
// select the key we need by running the command heroku keys:add, hit y to send this key to heroku
// now to create our application we run the command from our root directory(webserver) heroku create app-name
// the app name needs to be unique
//this will show 2 urls, one is our heroku url and other is the git repository where it wants our app code to be pushed. right now our app will be empty, lets configure on heroku
// we need to load our node modules within heroku so we add scripts for heroku to run
// add a start script with node src/app.js 
// now we need to modify the port within our app.js, since its not local. this value is provided by heroku by environment variable, check line 51 where we do this
//now in the app.js file within our public directory we change reference to local port and give the absolute path within the fetch call
// make a commit and upload code to heroku
// check git status
// there will be 3 files shown which have changed, in our case the node app.js the front end app.js and the package.json file

// now pus the code to git with git add.--> git commit --> git push (this will push code to our git)
// now we push the code to git remote from heroku, to do this lets list out all the remote git repos we have "git remote" run this command, it will show origin and heroku
// now run command "git push heroku master"

////////////new feature deployment workflow///////////////