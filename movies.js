
firebase.auth().onAuthStateChanged(async function(user){ 

    let db = firebase.firestore()
   
    if (user) {
        console.log('user logged in')
  
        db.collection('users').doc(user.uid).set({
            email: user.email,
            name: user.displayName
        }) //closes db user auth

        let currentUser = user.displayName
        document.querySelector('.sign-in-or-sign-out').innerHTML = `
        <div class="text-white-500 bold">Signed in as ${currentUser}</div>
        <a href="#" class="sign-out text-red-500 underline">Sign Out</a>
        `
        document.querySelector('.sign-out').addEventListener('click', function(event){
            event.preventDefault()
            firebase.auth().signOut()
            document.location.href= "movies.html"

        }) //closes sign-out event listener

        let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=2b8cc269ff18c13ce482d91d7f08f481&language=en-US`)
        let movies = await response.json()
        console.log(movies)
        
        let movieList = movies.results
        console.log(movieList.length)
    
        for(let i=0; i<movieList.length; i++){
            let movieID = movieList[i].id
            let moviePoster = movieList[i].poster_path
            
            document.querySelector('.movies').insertAdjacentHTML('beforeend', `
            <div class="w-1/5 p-4 movie-${movieID}">
                <img src="https://image.tmdb.org/t/p/w500/${moviePoster}" class="w-full">
                <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
             </div> 
             `)
            let userID = user.uid
            let compositeID = `${movieID}-${userID}`
            let checkMovieID = await db.collection('watched').doc(`${compositeID}`).get()
            if (checkMovieID.data()){
                document.querySelector(`.movie-${movieID}`).classList.add('opacity-20')
            } //closes if statement
           
            
            let movieLink = document.querySelector(`.movie-${movieID} .watched-button`)
            // console.log(movieLink)
            movieLink.addEventListener('click', async function(event){
            event.preventDefault()     
            console.log(`${movieID} was watched`)
            document.querySelector(`.movie-${movieID}`).classList.add('opacity-20')
                let docRef = await db.collection('watched').doc(`${compositeID}`).set({
                })    
            
            }) //finishes event listener
        } //finishes for loop
    
        let querySnapshot = await db.collection('watched').get()
            console.log(querySnapshot.size)
            
            let watched = querySnapshot.docs
            console.log(watched)
    
            for (let j=0; j < watched.length; j++){
                let watchedList = watched[j]
                console.log(watchedList)
                let watchedID = watchedList.id
                console.log(watchedID)
                let watchedData = watchedList.data()
                console.log(watchedData)
            }
  
      } else {
        console.log('no user')

        let ui = new firebaseui.auth.AuthUI(firebase.auth())

        let authUIConfig = {
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            signInSuccessUrl: 'movies.html'
        } //closes authUIConfig 
    
        ui.start('.sign-in-or-sign-out', authUIConfig)
       
    } //closes conditional if statement
   


  
}) //closes main function

  
  // Goal:   Refactor the movies application from last week, so that it supports
  //         user login and each user can have their own watchlist.
  
  // Start:  Your starting point is one possible solution for last week's homework.✅
  
  // Step 1: Add your Firebase configuration to movies.html, along with the
  //         (provided) script tags for all necessary Firebase services – i.e. Firebase
  //         Auth, Firebase Cloud Firestore, and Firebase UI for Auth; also
  //         add the CSS file for FirebaseUI for Auth. ✅
  // Step 2: Change the main event listener from DOMContentLoaded to 
  //         firebase.auth().onAuthStateChanged and include conditional logic 
  //         shows a login UI when signed, and the list of movies when signed
  //         in. Use the provided .sign-in-or-sign-out element to show the
  //         login UI. If a user is signed-in, display a message like "Signed 
  //         in as <name>" along with a link to "Sign out". Ensure that a document
  //         is set in the "users" collection for each user that signs in to 
  //         your application.✅
  // Step 3: Setting the TMDB movie ID as the document ID on your "watched" collection
  //         will no longer work. The document ID should now be a combination of the
  //         TMDB movie ID and the user ID indicating which user has watched. 
  //         This "composite" ID could simply be `${movieId}-${userId}`. This should 
  //         be set when the "I've watched" button on each movie is clicked. Likewise, 
  //         when the list of movies loads and is shown on the page, only the movies 
  //         watched by the currently logged-in user should be opaque. ✅
