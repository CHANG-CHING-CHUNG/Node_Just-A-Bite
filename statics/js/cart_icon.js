function displayNumInIcon() {
  const cartList = JSON.parse(docCookies.getItem('cartList'));
  let sum = 0;
  if( cartList ) {
    sum = cartList.map(item => item.item_quantity).reduce((acc, curr) => {
      return acc + curr
    },0)
  }
  $('.cart-item-count').text(sum);
}

function initIcon() {
  const cartList = JSON.parse(docCookies.getItem('cartList'));
  if( cartList ) {
    if(!$('.cart-item-count').hasClass('display')) {
      $('.cart-item-count').addClass('display');
      displayNumInIcon();
    }
  }
}

$(document).ready(initIcon);