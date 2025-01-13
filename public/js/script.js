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
// Select the elements
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('#navbarNavAltMarkup');
const bodyy = document.querySelector(".body-pro");
// Add event listener for the toggle button

navbarToggler.addEventListener('click', function () {
  // Check if the navbar is collapsed or expanded
  if (clicked){
    // Navbar is expanded, reset margin
    bodyy.style.marginTop = '1rem';
    clicked=false;
  } else {
    // Navbar is collapsed, add margin
    bodyy.style.marginTop = '11rem';
    bodyy.style.marginBottom = '1rem';
    clicked=true;
  }
});
