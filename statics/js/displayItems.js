const items = getItemsFromCookie();
let receivedItems;

function getItemsFromCookie() {
  return (JSON.parse(docCookies.getItem('cartList')));
}

function displayItems(receivedItem, number) {
  const tr = document.createElement("tr");
  tr.classList.add('list-item');
  let template = `<td class="item-num">
                      <span>${number+=1}</span>
                      <button>刪除</button>
                      <img src="/item_images/${receivedItem.item_image}" alt="">
                    </td>
                    <td class="item-name">${receivedItem.item_name}</td>
                    <td class="item-price">$${receivedItem.item_price}</td>
                    <td class="item-quantity">
                      <input min="0"  required type="number" class="quantity" value="${receivedItem.item_quantity}" />
                    </td>
                    <td class="item-subtotal"><p>$${receivedItem.item_price * receivedItem.item_quantity}</p>
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


function checkInputChanges(sentItems) {
  $('.quantity').each((i, element) => {
    $(element).on('input', () => {
      console.log(i)
      $(element).val( Math.abs(parseInt($(element).val())) )
      const cartList = updateCartItems(sentItems);
      cartList[i].item_quantity = parseInt($(element).val());
      setCookie(cartList);
    })
  })
}


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
    checkInputChanges(getItemsFromCookie())
  }
});

