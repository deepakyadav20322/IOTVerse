       

         // ------------- This validation only Change the box color ofter wrong and right value --------------------- 
  const fname = document.querySelector('.fname-val')
    const lastname = document.querySelector('.lastname-val')
    const email = document.querySelector('.email-val')
    const password = document.querySelector('.password-val');
    const phone = document.querySelector('.mobile-val');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const phoneRegex =  /^\d{10}$/;
    const charRgex =  /^[a-zA-Z ]{3,20}$/;
    // const emailRegex =/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g ;
    const emailRegex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    

    fname.addEventListener('keyup',()=>{
        const val1 = document.querySelector('.fname-val').value;
         if(val1.length>=3 && charRgex.test(val1)){
            fname.style.borderColor="green";
         }
         else{
            fname.style.borderColor="red";
         }
     })

     lastname.addEventListener('keyup',()=>{
        const val2 = document.querySelector('.lastname-val').value;
         if(val2.length>=3 && charRgex.test(val2)){
            lastname.style.borderColor="green";
         }
         else{
            lastname.style.borderColor="red";
         }
     })

     password.addEventListener('keyup',()=>{
         const val3 = document.querySelector('.password-val').value;
         if(passwordRegex.test(val3) ){
            password.style.borderColor="green";
         }
         else{
            password.style.borderColor="red";
         }

     })

     phone.addEventListener('keyup',()=>{
         const val4 = document.querySelector('.mobile-val').value;
         if(phoneRegex.test(val4) ){
            phone.style.borderColor="green";
         }
         else{
            phone.style.borderColor="red";
         }

     })

     email.addEventListener('keyup',()=>{
         const val5 = document.querySelector('.email-val').value;
         if(emailRegex.test(val5) ){
            email.style.borderColor="green";
         }
         else{
            email.style.borderColor="red";
         }

     })

   //   ------------********* This Validation Check that if givel input value not satisfy then give a alert box to the user (but form is not submitted till whereas input values not proper satisfy the regix) *************-------------/

   //  const myresisterForm = document.getElementById('myresisterForm');
   //  myresisterForm.addEventListener('submit',()=> {
   //    const password = document.querySelector(".pass1").value;
   //    if (password.length < 8) {
   //      alert("Password must be at least 8 characters long.");
   //      event.preventDefault();
   //    } 
   //  })