// add new tab in href to each outer URL automatically
var links = document.links;
for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noreferrer noopener';
  }
}

// this function is to make the card heights equal
$.fn.equalHeights = function(){
  var max_height = 0;

  $(this).each(function(){
  	max_height = Math.max($(this).height(), max_height);
  });

  $(this).each(function(){
    console.log(max_height);
  	$(this).height(max_height);
  });
};

// this code snippet is used to show the login message on login page
const status = window.location.href.includes('checkout_url');
const login_status = window.location.href.includes('checkout_url=%2F');
if((status) && login_status === false){
  document.getElementById("checkout-message").style.display = 'block';
}

// pick the checkout and hash value to show the resource tab by default
if(status){
  // get checkout URL
  var checkout_url = getParameterByName("checkout_url");

  var hash = location.hash;

  if(hash != ""){
    checkout_url = checkout_url + hash;
  }

  $("[name=checkout_url]").val(checkout_url);
}

// function to get the URL parameter values
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
