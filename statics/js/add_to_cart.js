
function iconBounce() {
  $('.order-add-cart').click(() => {
    if(!$('.cart-item-count').hasClass('display')) {
      $('.cart-item-count').addClass('display');
    }
    $('.cart-item-count').addClass('bouncing');
    setTimeout(() => {
      $('.cart-item-count').removeClass('bouncing');
    },200)
  })
}

iconBounce()

function getItemObj(event) {
  const itemId = parseInt($(event.target).parent().children('.item-id').val());
  const itemName = $(event.target).parent().children('.item-name').val();
  const itemPrice = parseInt($(event.target).parent().children('.item-price').val());

  return {
    id:itemId,
    item_name:itemName,
    item_price:itemPrice,
    item_quantity:1
  }
}

function setLocalStorage(itemObj) {
  let cartList;
  if(localStorage.getItem('cartList')) {
    cartList = JSON.parse(localStorage.getItem('cartList'));
  } else {
    cartList = [];
  }
  console.log(cartList)
  cartList.push(itemObj);
  localStorage.setItem('cartList',JSON.stringify(cartList));
}


$('.order-list').on('click' ,(event) => {
  if ($(event.target).is('.order-add-cart')) {
    const item = getItemObj(event);
    setLocalStorage(item)
    console.log(item)
  }
})