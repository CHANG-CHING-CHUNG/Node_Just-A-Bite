const items = getItemsFromCookie();
let receivedItems;

function getItemsFromCookie() {
  return (JSON.parse(docCookies.getItem('cartList')));
}

function displayItems(receivedItem, number) {
  const tr = document.createElement("tr");
  tr.classList.add('list-item');
  let template = `<td class="item-num">
                      <input type="hidden" class="item-id" value="${receivedItem.id}" />
                      <span>${number+=1}</span>
                      <button class="item-delete">刪除</button>
                      <img src="/item_images/${receivedItem.item_image}" alt="">
                    </td>
                    <td class="item-name">${receivedItem.item_name}</td>
                    <td class="item-price">$
                     <span class="price">${receivedItem.item_price}</span>
                    </td>
                    <td class="item-quantity">
                      <input min="0"  required type="number" class="quantity" value="${receivedItem.item_quantity}" />
                    </td>
                    <td class="item-subtotal">
                    <p>$
                     <span class="item-subtotal-val">${receivedItem.item_price * receivedItem.item_quantity}</span>
                    </p>
                  </td>`;
  tr.innerHTML = template;
  return tr;

}

function checkSoldout() {
  const quantityElements = $('.quantity');
  quantityElements.each((i,element) => {
    if( $(element).val() <= 0 ) {
      $(element).attr('disabled', true);
    }
  })
}

function updateCartItems(receivedItems) {
  const cartList = [];
  receivedItems.forEach((receivedItem,i) => {
    cartList.push({
      id: receivedItem.id,
      item_name: receivedItem.item_name,
      item_image:receivedItem.item_image,
      item_price: receivedItem.item_price,
      item_quantity: receivedItem.item_quantity
    });
  })
  return cartList;
}

function setCookie(updatedCartList) {
  docCookies.setItem('cartList',JSON.stringify(updatedCartList));
}



function updateItemSubtotal() {
  $('.item-subtotal .item-subtotal-val').each((i, subtotal) => {
    let quantity = parseInt($($('.quantity')[i]).val());
    let price = parseInt($($('.price')[i]).text())
    $(subtotal).text(price * quantity);
  });
}

function sumTheAmount() {
  let sum = 0;
  $('.item-subtotal .item-subtotal-val').each((i, subtotal) => {
    sum += parseInt($(subtotal).text());
  });
  return sum;
}

function updateSubtotal(sumSubtotal) {
  $('.subtotal-sum').text(sumSubtotal)
}

function displayTotal() {
  const subtotalSum = parseInt($('.subtotal-sum').text());
  const shiipingFee = parseInt($('.fee').text());
  $('.total-sum').text(subtotalSum + shiipingFee);
}

function checkShippingFee(subtotal) {
  if( subtotal >= 1000) {
    $('.shipping-fee .fee').text('99');
  } else {
    $('.shipping-fee .fee').text('0');
  }
}

function checkInputChanges(sentItems) {
  $('.quantity').each((i, element) => {
    $(element).on('input', () => {
      $(element).val( Math.abs(parseInt($(element).val())) )
      const cartList = updateCartItems(sentItems);
      cartList[i].item_quantity = parseInt($(element).val());
      setCookie(cartList);
      updateItemSubtotal();
      updateSubtotal(sumTheAmount());
      checkShippingFee(sumTheAmount());
      displayTotal()
    })
  })
}

function initDeleteItem() {
  $('.item-delete').on('click', (event) => {
    const itemId = parseInt($(event.target).parent().find('.item-id').val());
    deleteItem(itemId);
    updateItemSubtotal();
    updateSubtotal(sumTheAmount());
    checkShippingFee(sumTheAmount());
    displayTotal();
  })
}

function deleteItem(itemId) {
  const cartList = getItemsFromCookie();
  const filteredCartList = cartList.filter((item, i) => {
    if ( item.id === itemId ) {
      $($('.list-item')[i]).remove();
    }
    return item.id !== itemId;
  })
  setCookie(filteredCartList);
  const newCartList = getItemsFromCookie();
  if ( !newCartList.length ) {
    docCookies.removeItem('cartList');
  }
}

function createOrder() {
  const buyerId = parseInt($('.buyer_id').val());
  const buyerName = $('.buyer_name').val();
  const buyerPhone = $('.buyer_phone').val();
  const buyerEmail = $('.buyer_email').val();
  const buyerAddress = $('.buyer_address').val();
  const order = {
    items: getItemsFromCookie(),
    buyerInfo: {
      buyerId,
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress
    }
  }
  return order;
}

$('.cart-send').click(function (e) { 
  e.preventDefault();
  const order = createOrder();
  
});

if ( items.length ) {
  $.ajax({
    type: "POST",
    url: "/checkItems",
    data: {cartList:JSON.stringify(items)},
    dataType: "json",
    success: function (response) {
      receivedItems = JSON.parse(response);
      receivedItems.forEach((item,number) => {
        $('.list-items').append(displayItems(item,number));
      });
      setCookie(receivedItems);
      checkSoldout();
      updateItemSubtotal();
      updateSubtotal(sumTheAmount());
      checkShippingFee(sumTheAmount());
      displayTotal();
      initDeleteItem();
      checkInputChanges(getItemsFromCookie())
    }
  });
}

