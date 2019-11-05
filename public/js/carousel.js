let slideCurrent = 0;
let slideTimer = 0;
let slideDirection = 'right';
let isAutoSlideStopped = false;
let slides = $('.carousel-main img');

function carouselInit() {
  $('.arrow').on('click', arrowHandler);
  autoSwap();
}

function arrowHandler(event) {
  clearInterval(slideTimer);
  if(event.target.id === 'arrowLeft'){
    slideDirection = 'left';
  } else {
    slideDirection = 'right';
  }
  slideSwap();
}

function autoSwap() {
  slideTimer = setInterval(slideSwap, 3000);
}

function slideSwap() {
  $('.arrow').off('click', arrowHandler);
  let fadeout;
  let fadein;
  let slideNext;
  if(slideDirection === 'right'){
    fadeout = 'fadeout-right';
    fadein = 'fadein-left';
    slideNext = slideCurrent === slides.length - 1 ? 0 : slideCurrent + 1;
  } else {
    fadeout = 'fadeout-left';
    fadein = 'fadein-right';
    slideNext = slideCurrent === 0 ? slideNext = slides.length - 1 : slideCurrent - 1;
  }
  slides[slideCurrent].classList.add(fadeout);
  slides[slideNext].classList.add(fadein);
  slides[slideNext].classList.remove('op0');
  setTimeout(function(){
    slides[slideCurrent].className = '';
    slides[slideCurrent].classList.add('op0');
    slides[slideNext].className = '';
    slideCurrent = slideNext;
    $('.arrow').on('click', arrowHandler);
    slideDirection = 'right';
  }, 600);
}
