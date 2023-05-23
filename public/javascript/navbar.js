

// Header scroll....------------------------
// const nav =document.querySelector("navbar");
// window.onscroll = function(){
//     if(document)
// }

//===================== hide the navbar on click the navlink('a' tags) on home(main pages = =============================
  const navBar = document.querySelectorAll(".nav-link");
  const navCollapse =  document.querySelector(".navbar-collapse.collapse");
  navBar.forEach(function(a){
        a.addEventListener('click',function(){
            navCollapse.classList.remove("show");
        })
  });





// Get a specific cookie from browser to track the user......
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    const cookiedecode = decodeURIComponent(cookie[1]);
    if (cookie[0] === name) {
      return cookiedecode;
    }
  }
  return "";
}  

// Usage
const cookieValue = getCookie("user");
console.log(cookieValue); 

const loginbuuton = document.querySelector(".userlog-btn");
if(cookieValue!=""){
  loginbuuton.href = "/logout"
  loginbuuton.textContent= "Logout";
  
}

const resisterButton = document.querySelector(".resi-btn");
if(cookieValue!=""){
  resisterButton.href = "/gallery"
  resisterButton.textContent= "Gallery";
  
}
   





 function getEngMonth() {
            
            const months = [
                "January", "February", 
                "March", "April", "May", 
                "June", "July", "August",
                "September", "October", 
                "November", "December"
            ];
          }











//   function getCookie(name) {
//     const cookies = document.cookie.split('; ');
//     for (let i = 0; i < cookies.length; i++) {
//       const parts = cookies[i].split('=');
//       const cookieName = decodeURIComponent(parts[0]);
//       const cookieValue = decodeURIComponent(parts[1]);
//       if (cookieName === name) {
//         return cookieValue;
//       }
//     }
//     return null;
//   }

//   const myCookieValue = getCookie('user');
// console.log(myCookieValue);



 