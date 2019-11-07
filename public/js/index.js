'use strict';

function init() {
  carouselInit();
  $('#resourcesFormToggle').click(function(){
    $('#resources-request-form').toggle();
  });
}

$().ready(init);

