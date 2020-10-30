$('.btn-paid').each((i, btn) => {
  $(btn).click(() => {
    const orderNumber = parseInt($(btn).parent().parent().find('.order-number').text());
    $.ajax({
      type: "POST",
      url: "/checkout",
      data: {orderNumber},
      success: function (response) {
        const {html} = response;
        $('.orders-list').append(html);

      }
    })
  })
})