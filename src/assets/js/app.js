import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

//import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';

import 'tablesaw/dist/tablesaw.jquery';
import libs from './lib/dependancies';
window.libs = libs;

$(document).foundation();

libs.AOS.init();

// SVG Injector
// Elements to inject
var mySVGsToInject = document.querySelectorAll('img.inject-me');

// Options
var injectorOptions = {
  evalScripts: 'once',
  pngFallback: 'assets/png'
};

var afterAllInjectionsFinishedCallback = function (totalSVGsInjected) {
  // Callback after all SVGs are injected
  console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
};

var perInjectionCallback = function (svg) {
  // Callback after each SVG is injected
  console.log('SVG injected: ' + svg);
};

// create injector configured by options
var injector = new libs.svgInjector(injectorOptions);

// Trigger the injection
injector.inject(
  mySVGsToInject,
  afterAllInjectionsFinishedCallback,
  perInjectionCallback
);

// slick carousel
$(".content-carousel").slick({
  // normal options...
  speed: 5000,
	autoplay: true,
	autoplaySpeed: 0,
	cssEase: 'linear',
  slidesToShow: 5,
	slidesToScroll: 1,
  infinite: true,
  swipeToSlide: true,
	centerMode: true,
  focusOnSelect: true,
  // the magic
  responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        infinite: true
      }
    }, {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        dots: true
      }
    }, {
      breakpoint: 300,
      settings: "unslick" // destroys slick
    }]
});

// tablesaw table plugin
$(function () {
  $(document)
    .foundation()
    .trigger('enhance.tablesaw');
});

var TablesawConfig = {
  swipeHorizontalThreshold: 15
};

// app dashboard toggle
$('[data-app-dashboard-toggle-shrink]').on('click', function(e) {
  e.preventDefault();
  $(this).parents('.app-dashboard').toggleClass('shrink-medium').toggleClass('shrink-large');
});

// ajax to determine the country and cities in that country
$.ajax({
  type: 'GET',
  url: 'https://api.meetup.com/2/cities?&sign=true&photo-host=public&country=rs',
  contentType: 'text/plain',

  crossDomain: true,
  jsonpCallback: 'logResults',
  dataType: 'jsonp',

  xhrFields: {
    withCredentials: false
  },

  success: function(response) {
    logResults(response);

    $('.tabs-title').click(function(){
      var tabClicked = $(this).children('a').text();
      var tabHash = $(this).children('a').attr('href');

      $.ajax({
        type: 'GET',
        url: 'https://api.meetup.com/find/upcoming_events?photo-host=public&radius=100&sig_id=211970796&sig=e6635c2196d5c8f09a5e9b7195eb4e0c6e08feca',
        contentType: 'text/plain',
        dataType: 'jsonp',

        success: function(result) {
          var cevent = result.data.events;
          var arrc = new Array();
          for (var i in cevent){
            if(result.data.events[i].hasOwnProperty('venue')){
              if( tabClicked == result.data.events[i].venue.city ){
                arrc.push(result.data.events[i]);
              }
            }
          }
          
          console.log(arrc);
          for(var i in arrc){
            $(tabHash).append('<div class="content_event">'+ 
                              '<h2>' + arrc[i].name + '</h2>'+
                              '<div class="inner_block">' + arrc[i].description +'</div>'+
                              '</div>');
          }
        },
        error: function(result) {

        }
      });
    });
    
  },

  error: function(response) {
    alert(response.staus);
  }
});

// reinit the tabs
var elem = new Foundation.Tabs($('#cities-tabs'));

// function that collects all cities in Serbia
function logResults(data){
  var cities = data.results;
  
  for(var i in cities){
    var cityHash = 'city' + i;

    $('#cities-tabs').append('<li class="tabs-title"><a href="#'+ cityHash +'">'+ cities[i].city +'</a></li>');
    $('#cityContent').append('<div class="tabs-panel" id="' + cityHash + '">'+
                              '<h1>'+ cities[i].city +'</h1>'+
                              '</div>');
    elem = new Foundation.Tabs($('#cities-tabs'));
  }
};
