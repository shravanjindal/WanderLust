// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()
let clicked=false;
document.querySelector('.navbar-toggler').addEventListener('click', function () {
  const content = document.querySelector('.listing-container');
  if (!clicked){
    content.style.marginTop = '11rem';
    clicked=true;
  }
  else {
    content.style.marginTop = "1rem";
    clicked=false;
  }
});
