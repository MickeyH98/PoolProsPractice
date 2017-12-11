var dealerData;
$(document).ready(function(){

    // $(".filter__input").prop("checked", true);

    $(window).on("resize", function(){
        if( $(document).width() > 1024 ){
            //make sure filters show on desktop
            $(".filters__container").css("display", "block");
            //make sure mobile menu is closed on desktop
            $(".mobile-menu").css("right", "-100vw");
            //remove bottom border from filter button
            $(".filters__toggle").css("border-bottom", "none");
        }
    })

    //toggle filter display on click
    $(".filters__toggle").on("click", function(){

        if( $(document).width() < 1024 ){

            //open/close filters
            $(".filters__container").slideToggle();

            //display bottom border properly
            if( $(".filters__toggle").css("border-bottom") == "1px solid rgb(216, 216, 216)" ){
                $(".filters__toggle").css("border-bottom", "none");
            }else {
                $(".filters__toggle").css("border-bottom", "solid 1px #D8D8D8");
            }
        }
    })

    //mobile menu slideout
    $(".header__mobile-menu").on("click", function(){
        $(".mobile-menu").css("right", "0");
    })

    //close mobile menu
    $(".mobile-menu__close").on("click", function(){
        $(".mobile-menu").css("right", "-100vw");
    })

    //open modal
    $(document).on("click", ".card__email", function(){
        $(".modal__wrapper").css("display", "block");
    })

    //close modal on desktop
    $(".modal__close").on("click", function(){
        $(".modal__wrapper").css("display", "none");
    })

    //close modal on mobile
    $(".modal__wrapper").on("click", function(){
        $(this).css("display", "none");
    }).children().click(function(e) {
        return false; //prevent modal from closing when clicked on
      });

    //Make request to dealers.json and parse JSON response into an object
    fetch("assets/js/dealers.json")
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
  
        // Examine the text in the response
        response.json().then(function(data) {
            //send dealer data to global scope
            dealerData = data;
            //create all cards
            buildCards(dealerData.dealers);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

});

function buildCards(data){

    data.forEach(element => {
      var satHours = element.data.weekHours.sat;
      var sunHours = element.data.weekHours.sun;
      var certifications = "";

      if(element.data.certifications.includes("Installation Pro")){
          certifications += "<li><img src='assets/img/star-installation-pro.png' alt='Installation Pro'/> Installation Pro</li>";
      }

      if(element.data.certifications.includes("Service Pro")){
          certifications += "<li><img src='assets/img/gear-service-pro.png' alt='Service Pro'> Service Pro</li>";
      }

      if(element.data.certifications.includes("Residential Pro")){
          certifications += "<li><img src='assets/img/home-residential-pro.png' alt='Residential Pro'> Residential Pro</li>";
      }

      if(element.data.certifications.includes("Commercial Pro")){
          certifications += "<li><img src='assets/img/users-commercial-pro.png' alt='Commercial Pro'> Commercial Pro</li>";
      }

      if(satHours === ""){
      satHours = " - CLOSED";
      }

      if(sunHours === ""){
      sunHours = " - CLOSED";
      }

      var card = `
        <div class='columns large-4 section__columns'>
            <div class='card'>
                <h3 class='card__title'>${element.data.name}</h3>
                <div class='card__call'>
                    <img class='card__phone-mobile' src='assets/img/phone-icon-mobile.png' alt='Phone Icon'>
                    <img class='card__phone-desktop' src='assets/img/phone-icon-desktop.png' alt='Phone Icon'>
                    <p><span>Tap to call </span>1.888.888.8888</p>
                </div>
                <p class='card__subtext'>Can’t talk now? Click below to send an email.</p>
                <a class='card__email button button__secondary' href='#'><img src='assets/img/email-icon.png' alt='Email Icon'> Contact this Pro</a>
                <h3 class='card__hours-title'>Business Hours</h3>
                <ul class='card__hours'>
                    <li>Weekdays ${element.data.weekHours.mon}</li>
                    <li>Saturdays ${satHours}</li>
                    <li>Sundays ${sunHours}</li>
                </ul>
                <div class='card__certifications'>
                    <ul class='card__certification-list'>
                        ${certifications}
                    </ul>
                </div>
            </div> <!-- .card -->
        </div>
      `;

      $(".section__cards").append(card);
    
    });
}

function checkboxToggled(filter){
    //remove all cards
    $(".section__columns").remove();

    var newDealers = [];
    
    //check for filters
    for(var i = 0; i < dealerData.dealers.length; i++){
        var certifications = dealerData.dealers[i].data.certifications;

        if( $("#filter-service").prop("checked") && $.inArray(filter, certifications) != -1){
            newDealers.push(dealerData.dealers[i]);
        }
    
        if( $("#filter-installation").prop("checked") && $.inArray(filter, certifications) != -1){
            newDealers.push(dealerData.dealers[i]);
        }
    
        if( $("#filter-residential").prop("checked") && $.inArray(filter, certifications) != -1){
            newDealers.push(dealerData.dealers[i]);
        }
    
        if( $("#filter-commercial").prop("checked") && $.inArray(filter, certifications) != -1){
            newDealers.push(dealerData.dealers[i]);
        }
    }

    //filter through array to remove copies
    var filteredDealers = [];

    $.each(newDealers, function(i, dealer){

        if($.inArray(dealer, filteredDealers) === -1){
            filteredDealers.push(dealer);
        }
        
    });

    buildCards(filteredDealers);
    
}